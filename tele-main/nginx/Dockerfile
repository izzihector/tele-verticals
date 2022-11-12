FROM nginx:latest

ARG TELE_CERT_NAME

ENV TELE_CERT_NAME "module.tele.studio"
ENV TELE_SERVER_NAME "web"
ENV TELE_DOMAIN "module.tele.studio"
ENV TELE_LOCAL_PORT "8089"

COPY nginx.conf /etc/nginx/nginx.conf
# COPY dhparam.pem /etc/letsencrypt/ssl-dhparams.pem
# COPY options-ssl-nginx.conf /etc/letsencrypt/options-ssl-nginx.conf
# COPY certs/$TELE_CERT_NAME.crt /etc/ssl/certs/$TELE_CERT_NAME.crt
# COPY certs/$TELE_CERT_NAME.key /etc/ssl/private/$TELE_CERT_NAME.key

RUN grep -l "\$TELE_CERT_NAME" /etc/nginx/nginx.conf | xargs sed -i "s/\$TELE_CERT_NAME/$TELE_CERT_NAME/g"
RUN grep -l "\$TELE_SERVER_NAME" /etc/nginx/nginx.conf | xargs sed -i "s/\$TELE_SERVER_NAME/$TELE_SERVER_NAME/g"
RUN grep -l "\$TELE_DOMAIN" /etc/nginx/nginx.conf | xargs sed -i "s/\$TELE_DOMAIN/$TELE_DOMAIN/g"
RUN grep -l "\$TELE_LOCAL_PORT" /etc/nginx/nginx.conf | xargs sed -i "s/\$TELE_LOCAL_PORT/$TELE_LOCAL_PORT/g"
