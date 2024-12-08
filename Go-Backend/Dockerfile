# syntax=docker/dockerfile:1

################################################################################
# Create a stage for building the application.
ARG GO_VERSION=1.21.6
FROM --platform=$BUILDPLATFORM golang:${GO_VERSION} AS build
WORKDIR /src

# Download dependencies as a separate step to take advantage of Docker's caching.
RUN --mount=type=cache,target=/go/pkg/mod/ \
    --mount=type=bind,source=go.sum,target=go.sum \
    --mount=type=bind,source=go.mod,target=go.mod \
    go mod download -x

ARG TARGETARCH

# Build the application.
RUN --mount=type=cache,target=/go/pkg/mod/ \
    --mount=type=bind,target=. \
    CGO_ENABLED=0 GOARCH=$TARGETARCH go build -o /bin/server .

################################################################################
# Create a new stage for running the application and PostgreSQL.
FROM alpine:latest AS final

# Install runtime dependencies, including PostgreSQL.
RUN --mount=type=cache,target=/var/cache/apk \
    apk --update add \
    ca-certificates \
    tzdata \
    postgresql \
    postgresql-contrib \
    && \
    update-ca-certificates

# Create a non-privileged user for the application.
ARG UID=10001
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    appuser

# Set up PostgreSQL data directory and permissions.
RUN mkdir -p /var/lib/postgresql/data \
    && chown -R postgres:postgres /var/lib/postgresql

USER postgres
RUN initdb -D /var/lib/postgresql/data


# Switch back to root to copy the Go application.
USER root
COPY --from=build /bin/server /bin/
RUN chown appuser:appuser /bin/server

# Switch to the non-privileged user for running the Go application.
USER appuser

# Expose ports for PostgreSQL and Go application.
EXPOSE 5432
EXPOSE 8000

# Start PostgreSQL and the Go server.
CMD sh -c "postgres -D /var/lib/postgresql/data & /bin/server"
