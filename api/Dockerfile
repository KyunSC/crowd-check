# =============================================================================
# MULTI-STAGE DOCKERFILE FOR .NET API
# =============================================================================
#
# Docker builds images in "stages". Think of each stage as a temporary computer
# that does one job and then gets thrown away. Only the LAST stage becomes your
# final image. This lets us use heavy build tools (SDK ~900MB) during
# compilation but ship only the lightweight runtime (~100MB).
#
# The flow:
#   Stage 1 ("build")   — has the full .NET SDK, restores packages, compiles code
#   Stage 2 ("publish") — runs `dotnet publish` to create optimized output
#   Stage 3 ("runtime") — tiny image with just the .NET runtime + your compiled app
#
# =============================================================================


# ---------------------------------------------------------------------------
# STAGE 1: restore — download NuGet packages (cached separately for speed)
# ---------------------------------------------------------------------------
# `FROM` tells Docker which base image to start from.
# `mcr.microsoft.com/dotnet/sdk:10.0` is Microsoft's official image that has
# the full .NET SDK (compiler, NuGet, etc.) pre-installed.
# `AS build` gives this stage a name so later stages can COPY files from it.
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

# Set the working directory inside the container.
# All subsequent commands run relative to this path.
# This is like `cd /src` but it also creates the directory if it doesn't exist.
WORKDIR /src

# Copy ONLY the .csproj file first, then restore.
# Why not copy everything at once? Docker caches each step (called a "layer").
# If the .csproj hasn't changed, Docker skips the restore step entirely on
# subsequent builds — saving minutes. Your source code changes frequently,
# but your dependencies don't, so we separate them.
COPY CrowdCheck.Api.csproj .
RUN dotnet restore

# Now copy the rest of the source code.
# This layer is rebuilt every time your code changes, but the restore layer
# above is cached (unless you changed a package reference in .csproj).
COPY . .


# ---------------------------------------------------------------------------
# STAGE 2: publish — compile and optimize for production
# ---------------------------------------------------------------------------
# We continue in the same stage (no new FROM) since we already have the SDK.
# `dotnet publish` does: compile → tree-shake → bundle into a deployment folder.
# -c Release        → optimized build (no debug symbols, faster code)
# -o /app/publish   → output directory
RUN dotnet publish -c Release -o /app/publish


# ---------------------------------------------------------------------------
# STAGE 3: runtime — the final, minimal image that actually runs
# ---------------------------------------------------------------------------
# This starts a NEW image from scratch. Everything from the build stage is
# thrown away. We use `aspnet:10.0` which is much smaller than `sdk:10.0`
# because it only has the runtime (can run .NET apps but can't compile them).
#
# Image sizes:
#   sdk:10.0    → ~900MB (has compiler, NuGet, MSBuild, etc.)
#   aspnet:10.0 → ~100MB (just the runtime)
#
# Your final Docker image will be ~100MB + your app (~5MB) ≈ ~105MB total.
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

# Copy the compiled output from the publish stage into this clean image.
# `--from=build` refers to the stage named "build" above.
# Only the files in /app/publish are copied — no source code, no SDK.
COPY --from=build /app/publish .

# Tell ASP.NET to listen on port 8080 inside the container.
# This doesn't "open" the port to the outside world — that's done in
# docker-compose.yml with the `ports:` mapping. This just tells Kestrel
# (ASP.NET's built-in web server) which port to bind to.
ENV ASPNETCORE_URLS=http://+:8080

# Document that this container listens on 8080.
# EXPOSE is purely informational — it doesn't actually publish the port.
# Think of it as documentation for anyone reading the Dockerfile.
EXPOSE 8080

# The command that runs when the container starts.
# Since we published the app, the output is a DLL named after our project.
# `dotnet CrowdCheck.Api.dll` starts the Kestrel web server.
ENTRYPOINT ["dotnet", "CrowdCheck.Api.dll"]
