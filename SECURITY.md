# Security Policy

Super Admin is in active `0.x` development after its initial npm release. Security reports are welcome for the repository, published packages, generated starter output, and maintainer release pipeline.

## Reporting Security Issues

Please do not disclose security issues publicly before maintainers have had a chance to respond.

For now, open a private security advisory on GitHub if available, or contact the project maintainer directly. Include:

- affected package or app
- reproduction steps
- expected impact
- any suggested fix or mitigation

## Scope

Security-sensitive areas include:

- auth/session examples
- optional reference backend behavior
- generated project defaults
- adapter examples that handle credentials or tokens
- dependency or release pipeline issues

The default scaffold must not require users to store secrets in client-side state or generated files.
