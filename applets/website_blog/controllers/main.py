# -*- coding: utf-8 -*-
# Part of Tele. See LICENSE file for full copyright and licensing details.

import re
import werkzeug
import itertools
import pytz
import babel.dates
from collections import OrderedDict

from tele import http, fields
from tele.applets.http_routing.models.ir_http import slug, unslug
from tele.applets.website.controllers.main import QueryURL
from tele.applets.portal.controllers.portal import _build_url_w_params
from tele.http import request
from tele.osv import expression
from tele.tools import html2plaintext
from tele.tools.misc import get_lang
from tele.tools import sql


class WebsiteBlog(http.Controller):
    _blog_post_per_page = 12  # multiple of 2,3,4
    _post_comment_per_page = 10

    def tags_list(self, tag_ids, current_tag):
        tag_ids = list(tag_ids)  # required to avoid using the same list
        if current_tag in tag_ids:
            tag_ids.remove(current_tag)
        else:
            tag_ids.append(current_tag)
        tag_ids = request.env['blog.tag'].browse(tag_ids)
        return ','.join(slug(tag) for tag in tag_ids)

    def nav_list(self, blog=None):
        dom = blog and [('blog_id', '=', blog.id)] or []
        if not request.env.user.has_group('website.group_website_designer'):
            dom += [('post_date', '<=', fields.Datetime.now())]
        groups = request.env['blog.post']._read_group_raw(
            dom,
            ['name', 'post_date'],
            groupby=["post_date"], orderby="post_date desc")
        for group in groups:
            (r, label) = group['post_date']
            start, end = r.split('/')
            group['post_date'] = label
            group['date_begin'] = start
            group['date_end'] = end

            locale = get_lang(request.env).code
            start = pytz.UTC.localize(fields.Datetime.from_string(start))
            tzinfo = pytz.timezone(request.context.get('tz', 'utc') or 'utc')

            group['month'] = babel.dates.format_datetime(start, format='MMMM', tzinfo=tzinfo, locale=locale)
            group['year'] = babel.dates.format_datetime(start, format='yyyy', tzinfo=tzinfo, locale=locale)

        return OrderedDict((year, [m for m in months]) for year, months in itertools.groupby(groups, lambda g: g['year']))

    def _prepare_blog_values(self, blogs, blog=False, date_begin=False, date_end=False, tags=False, state=False, page=False, search=None):
        """ Prepare all values to display the blogs index page or one specific blog"""
        BlogPost = request.env['blog.post']
        BlogTag = request.env['blog.tag']

        # prepare domain
        domain = request.website.website_domain()

        if blog:
            domain += [('blog_id', '=', blog.id)]

        if date_begin and date_end:
            domain += [("post_date", ">=", date_begin), ("post_date", "<=", date_end)]
        active_tag_ids = tags and [unslug(tag)[1] for tag in tags.split(',')] or []
        active_tags = BlogTag
        if active_tag_ids:
            active_tags = BlogTag.browse(active_tag_ids).exists()
            fixed_tag_slug = ",".join(slug(t) for t in active_tags)
            if fixed_tag_slug != tags:
                path = request.httprequest.full_path
                new_url = path.replace("/tag/%s" % tags, fixed_tag_slug and "/tag/%s" % fixed_tag_slug or "", 1)
                if new_url != path:  # check that really replaced and avoid loop
                    return request.redirect(new_url, 301)
            domain += [('tag_ids', 'in', active_tags.ids)]

        if request.env.user.has_group('website.group_website_designer'):
            count_domain = domain + [("website_published", "=", True), ("post_date", "<=", fields.Datetime.now())]
            published_count = BlogPost.search_count(count_domain)
            unpublished_count = BlogPost.search_count(domain) - published_count

            if state == "published":
                domain += [("website_published", "=", True), ("post_date", "<=", fields.Datetime.now())]
            elif state == "unpublished":
                domain += ['|', ("website_published", "=", False), ("post_date", ">", fields.Datetime.now())]
        else:
            domain += [("post_date", "<=", fields.Datetime.now())]

        use_cover = request.website.is_view_active('website_blog.opt_blog_cover_post')
        fullwidth_cover = request.website.is_view_active('website_blog.opt_blog_cover_post_fullwidth_design')

        # if blog, we show blog title, if use_cover and not fullwidth_cover we need pager + latest always
        offset = (page - 1) * self._blog_post_per_page
        if not blog:
            if use_cover and not fullwidth_cover and not tags and not date_begin and not date_end:
                offset += 1

        options = {
            'displayDescription': True,
            'displayDetail': False,
            'displayExtraDetail': False,
            'displayExtraLink': False,
            'displayImage': False,
            'allowFuzzy': not request.params.get('noFuzzy'),
            'blog': str(blog.id) if blog else None,
            'tag': ','.join([str(id) for id in active_tags.ids]),
            'date_begin': date_begin,
            'date_end': date_end,
            'state': state,
        }
        total, details, fuzzy_search_term = request.website._search_with_fuzzy("blog_posts_only", search,
            limit=page * self._blog_post_per_page, order="is_published desc, post_date desc, id asc", options=options)
        posts = details[0].get('results', BlogPost)
        first_post = BlogPost
        if posts and not blog and posts[0].website_published:
            first_post = posts[0]
        posts = posts[offset:offset + self._blog_post_per_page]

        url_args = dict()
        if search:
            url_args["search"] = search

        if date_begin and date_end:
            url_args["date_begin"] = date_begin
            url_args["date_end"] = date_end

        pager = request.website.pager(
            url=request.httprequest.path.partition('/page/')[0],
            total=total,
            page=page,
            step=self._blog_post_per_page,
            url_args=url_args,
        )

        if not blogs:
            all_tags = request.env['blog.tag']
        else:
            all_tags = blogs.all_tags(join=True) if not blog else blogs.all_tags().get(blog.id, request.env['blog.tag'])
        tag_category = sorted(all_tags.mapped('category_id'), key=lambda category: category.name.upper())
        other_tags = sorted(all_tags.filtered(lambda x: not x.category_id), key=lambda tag: tag.name.upper())

        # for performance prefetch the first post with the others
        post_ids = (first_post | posts).ids
        # and avoid accessing related blogs one by one
        posts.blog_id

        return {
            'date_begin': date_begin,
            'date_end': date_end,
            'first_post': first_post.with_prefetch(post_ids),
            'other_tags': other_tags,
            'tag_category': tag_category,
            'nav_list': self.nav_list(),
            'tags_list': self.tags_list,
            'pager': pager,
            'posts': posts.with_prefetch(post_ids),
            'tag': tags,
            'active_tag_ids': active_tags.ids,
            'domain': domain,
            'state_info': state and {"state": state, "published": published_count, "unpublished": unpublished_count},
            'blogs': blogs,
            'blog': blog,
            'search': fuzzy_search_term or search,
            'search_count': total,
            'original_search': fuzzy_search_term and search,
        }

    @http.route([
        '/blog',
        '/blog/page/<int:page>',
        '/blog/tag/<string:tag>',
        '/blog/tag/<string:tag>/page/<int:page>',
        '''/blog/<model("blog.blog"):blog>''',
        '''/blog/<model("blog.blog"):blog>/page/<int:page>''',
        '''/blog/<model("blog.blog"):blog>/tag/<string:tag>''',
        '''/blog/<model("blog.blog"):blog>/tag/<string:tag>/page/<int:page>''',
    ], type='http', auth="public", website=True, sitemap=True)
    def blog(self, blog=None, tag=None, page=1, search=None, **opt):
        Blog = request.env['blog.blog']

        # TODO adapt in master. This is a fix for templates wrongly using the
        # 'blog_url' QueryURL which is defined below. Indeed, in the case where
        # we are rendering a blog page where no specific blog is selected we
        # define(d) that as `QueryURL('/blog', ['tag'], ...)` but then some
        # parts of the template used it like this: `blog_url(blog=XXX)` thus
        # generating an URL like "/blog?blog=blog.blog(2,)". Adding "blog" to
        # the list of params would not be right as would create "/blog/blog/2"
        # which is still wrong as we want "/blog/2". And of course the "/blog"
        # prefix in the QueryURL definition is needed in case we only specify a
        # tag via `blog_url(tab=X)` (we expect /blog/tag/X). Patching QueryURL
        # or making blog_url a custom function instead of a QueryURL instance
        # could be a solution but it was judged not stable enough. We'll do that
        # in master. Here we only support "/blog?blog=blog.blog(2,)" URLs.
        if isinstance(blog, str):
            blog = Blog.browse(int(re.search(r'\d+', blog)[0]))
            if not blog.exists():
                raise werkzeug.exceptions.NotFound()

        blogs = Blog.search(request.website.website_domain(), order="create_date asc, id asc")

        if not blog and len(blogs) == 1:
            return request.redirect('/blog/%s' % slug(blogs[0]), code=302)

        date_begin, date_end, state = opt.get('date_begin'), opt.get('date_end'), opt.get('state')

        if tag and request.httprequest.method == 'GET':
            # redirect get tag-1,tag-2 -> get tag-1
            tags = tag.split(',')
            if len(tags) > 1:
                url = QueryURL('' if blog else '/blog', ['blog', 'tag'], blog=blog, tag=tags[0], date_begin=date_begin, date_end=date_end, search=search)()
                return request.redirect(url, code=302)

        values = self._prepare_blog_values(blogs=blogs, blog=blog, date_begin=date_begin, date_end=date_end, tags=tag, state=state, page=page, search=search)

        # in case of a redirection need by `_prepare_blog_values` we follow it
        if isinstance(values, werkzeug.wrappers.Response):
            return values

        if blog:
            values['main_object'] = blog
            values['edit_in_backend'] = True
            values['blog_url'] = QueryURL('', ['blog', 'tag'], blog=blog, tag=tag, date_begin=date_begin, date_end=date_end, search=search)
        else:
            values['blog_url'] = QueryURL('/blog', ['tag'], date_begin=date_begin, date_end=date_end, search=search)

        return request.render("website_blog.blog_post_short", values)

    @http.route(['''/blog/<model("blog.blog"):blog>/feed'''], type='http', auth="public", website=True, sitemap=True)
    def blog_feed(self, blog, limit='15', **kwargs):
        v = {}
        v['blog'] = blog
        v['base_url'] = blog.get_base_url()
        v['posts'] = request.env['blog.post'].search([('blog_id', '=', blog.id)], limit=min(int(limit), 50), order="post_date DESC")
        v['html2plaintext'] = html2plaintext
        r = request.render("website_blog.blog_feed", v, headers=[('Content-Type', 'application/atom+xml')])
        return r

    @http.route([
        '''/blog/<model("blog.blog"):blog>/post/<model("blog.post", "[('blog_id','=',blog.id)]"):blog_post>''',
    ], type='http', auth="public", website=True, sitemap=False)
    def old_blog_post(self, blog, blog_post, tag_id=None, page=1, enable_editor=None, **post):
        # Compatibility pre-v14
        return request.redirect(_build_url_w_params("/blog/%s/%s" % (slug(blog), slug(blog_post)), request.params), code=301)

    @http.route([
        '''/blog/<model("blog.blog"):blog>/<model("blog.post", "[('blog_id','=',blog.id)]"):blog_post>''',
    ], type='http', auth="public", website=True, sitemap=True)
    def blog_post(self, blog, blog_post, tag_id=None, page=1, enable_editor=None, **post):
        """ Prepare all values to display the blog.

        :return dict values: values for the templates, containing

         - 'blog_post': browse of the current post
         - 'blog': browse of the current blog
         - 'blogs': list of browse records of blogs
         - 'tag': current tag, if tag_id in parameters
         - 'tags': all tags, for tag-based navigation
         - 'pager': a pager on the comments
         - 'nav_list': a dict [year][month] for archives navigation
         - 'next_post': next blog post, to direct the user towards the next interesting post
        """
        BlogPost = request.env['blog.post']
        date_begin, date_end = post.get('date_begin'), post.get('date_end')

        domain = request.website.website_domain()
        blogs = blog.search(domain, order="create_date, id asc")

        tag = None
        if tag_id:
            tag = request.env['blog.tag'].browse(int(tag_id))
        blog_url = QueryURL('', ['blog', 'tag'], blog=blog_post.blog_id, tag=tag, date_begin=date_begin, date_end=date_end)

        if not blog_post.blog_id.id == blog.id:
            return request.redirect("/blog/%s/%s" % (slug(blog_post.blog_id), slug(blog_post)), code=301)

        tags = request.env['blog.tag'].search([])

        # Find next Post
        blog_post_domain = [('blog_id', '=', blog.id)]
        if not request.env.user.has_group('website.group_website_designer'):
            blog_post_domain += [('post_date', '<=', fields.Datetime.now())]

        all_post = BlogPost.search(blog_post_domain)

        if blog_post not in all_post:
            return request.redirect("/blog/%s" % (slug(blog_post.blog_id)))

        # should always return at least the current post
        all_post_ids = all_post.ids
        current_blog_post_index = all_post_ids.index(blog_post.id)
        nb_posts = len(all_post_ids)
        next_post_id = all_post_ids[(current_blog_post_index + 1) % nb_posts] if nb_posts > 1 else None
        next_post = next_post_id and BlogPost.browse(next_post_id) or False

        values = {
            'tags': tags,
            'tag': tag,
            'blog': blog,
            'blog_post': blog_post,
            'blogs': blogs,
            'main_object': blog_post,
            'nav_list': self.nav_list(blog),
            'enable_editor': enable_editor,
            'next_post': next_post,
            'date': date_begin,
            'blog_url': blog_url,
        }
        response = request.render("website_blog.blog_post_complete", values)

        if blog_post.id not in request.session.get('posts_viewed', []):
            if sql.increment_field_skiplock(blog_post, 'visits'):
                if not request.session.get('posts_viewed'):
                    request.session['posts_viewed'] = []
                request.session['posts_viewed'].append(blog_post.id)
                request.session.modified = True
        return response

    @http.route('/blog/<int:blog_id>/post/new', type='http', auth="user", website=True)
    def blog_post_create(self, blog_id, **post):
        # Use sudo so this line prevents both editor and admin to access blog from another website
        # as browse() will return the record even if forbidden by security rules but editor won't
        # be able to access it
        if not request.env['blog.blog'].browse(blog_id).sudo().can_access_from_current_website():
            raise werkzeug.exceptions.NotFound()

        new_blog_post = request.env['blog.post'].create({
            'blog_id': blog_id,
            'is_published': False,
        })
        return request.redirect("/blog/%s/%s?enable_editor=1" % (slug(new_blog_post.blog_id), slug(new_blog_post)))

    @http.route('/blog/post_duplicate', type='http', auth="user", website=True, methods=['POST'])
    def blog_post_copy(self, blog_post_id, **post):
        """ Duplicate a blog.

        :param blog_post_id: id of the blog post currently browsed.

        :return redirect to the new blog created
        """
        new_blog_post = request.env['blog.post'].with_context(mail_create_nosubscribe=True).browse(int(blog_post_id)).copy()
        return request.redirect("/blog/%s/%s?enable_editor=1" % (slug(new_blog_post.blog_id), slug(new_blog_post)))
