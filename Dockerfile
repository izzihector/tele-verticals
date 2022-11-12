FROM ubuntu:20.04

LABEL maintainer="Tele"

# Install some deps, lessc and less-plugin-clean-css, and wkhtmltopdf
RUN set -x; \
        apt-get update \
        && apt-get install -y --no-install-recommends \
            ca-certificates \
            apt-utils \
            sudo \
            curl \
            dirmngr \
            node-less \
            python3-pip  \
            docker.io \
	    python3-setuptools \
	    gnupg \
        && curl -o wkhtmltox.deb -sSL https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6-1/wkhtmltox_0.12.6-1.focal_amd64.deb \
        && apt install ./wkhtmltox.deb -y \
        && apt-get -y install -f --no-install-recommends \
        && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false -o APT::AutoRemove::SuggestsImportant=false \
        && rm -rf /var/lib/apt/lists/* wkhtmltox.deb \
        && pip3 install psycogreen==1.0

# install latest postgresql-client
RUN set -x; \
        echo 'deb http://apt.postgresql.org/pub/repos/apt/ focal-pgdg main' > etc/apt/sources.list.d/pgdg.list \
        && export GNUPGHOME="$(mktemp -d)" \
        && repokey='B97B0AFCAA1A47F044F244A07FCC7D46ACCC4CF8' \
        && gpg --batch --keyserver keyserver.ubuntu.com --recv-keys "${repokey}" \
        && gpg --batch --armor --export "${repokey}" > /etc/apt/trusted.gpg.d/pgdg.gpg.asc \
        && gpgconf --kill all \
        && rm -rf "$GNUPGHOME" \
        && apt-get update  \
        && apt-get install -y postgresql-client \
        && rm -rf /var/lib/apt/lists/* \
	&& apt update && apt-get install -y npm \
	&& npm install -g less less-plugin-clean-css \
	&& apt-get install -y node-less

# Install Tele
ENV TELE_VERSION main

#This binds to service file.So, take care
ARG TELE_USER=tele
#This binds to service file.So, take care
ARG TELE_USER=tele
ARG TELE_USER_UID=998
ARG TELE_USER_GID=998
ARG TELE_USER_PASSWD=tele

RUN set -x; \
        groupadd -r -g ${TELE_USER_GID} ${TELE_USER} \
        && adduser --system --home=/opt/${TELE_USER} ${TELE_USER} --uid ${TELE_USER_UID} --gid ${TELE_USER_GID} \
        && apt update && apt-get install -y git libpq-dev libxml2-dev libxslt-dev libffi-dev gcc python3-dev libsasl2-dev python-dev libldap2-dev libssl-dev libjpeg-dev \
        && su - ${TELE_USER} -s /bin/bash -c "git clone https://www.github.com/tele-studio/tele-docker  /opt/tele/tele-server" \
        && mkdir /var/log/tele \
        && chown ${TELE_USER}:root /var/log/tele

# Install rtlcss (on Debian buster)
RUN npm install -g rtlcss


RUN pip3 install -r /opt/tele/tele-server/requirements.txt

RUN cp /opt/tele/tele-server/setup/tele /opt/tele/tele-server/tele-make && chmod +x /opt/tele/tele-server/tele-make

# Copy entrypoint script and Tele configuration file
COPY --chown=tele:tele ./entrypoint.sh /
COPY --chown=tele:tele ./tele.conf /etc/tele/

# Set permissions and Mount /var/lib/tele to allow restoring filestore and /mnt/extra-applets for users applets
RUN chown tele /etc/tele/tele.conf \
    && mkdir -p /mnt/extra-applets \
    && chown -R tele /mnt/extra-applets \
    && mkdir -p /var/lib/tele \
    && chown -R tele /var/lib/tele 
VOLUME ["/var/lib/tele", "/mnt/extra-applets"]

# Expose Tele services
EXPOSE 8069 8071 8072

# Set the default config file
ENV TELE_RC /etc/tele/tele.conf

COPY --chown=tele:tele wait-for-psql.py /usr/local/bin/wait-for-psql.py


COPY ./common-applets_v1 /opt/tele/common-applets_v1


# Set default user when running the container
USER tele

ENTRYPOINT ["/entrypoint.sh"]
CMD ["tele"]
