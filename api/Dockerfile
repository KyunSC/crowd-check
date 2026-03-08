# =============================================================================
# MULTI-STAGE DOCKERFILE FOR .NET API
# =============================================================================
#
# Three stages:
#   1. "build"   — full .NET SDK, restores packages and compiles
#   2. publish   — `dotnet publish` creates optimized output (same stage)
#   3. "runtime" — minimal Alpine image with just the runtime + compiled app
#
# =============================================================================


# ---------------------------------------------------------------------------
# STAGE 1: restore + build
# ---------------------------------------------------------------------------
FROM mcr.microsoft.com/dotnet/sdk:10.0-alpine AS build
WORKDIR /src

# Copy .csproj first for layer caching (dependencies change less often)
COPY CrowdCheck.Api.csproj .
RUN dotnet restore

# Copy source and publish
COPY . .
RUN dotnet publish -c Release -o /app/publish


# ---------------------------------------------------------------------------
# STAGE 2: runtime — minimal Alpine image
# ---------------------------------------------------------------------------
# Alpine images are ~50MB vs ~100MB for the full Debian-based image.
FROM mcr.microsoft.com/dotnet/aspnet:10.0-alpine AS runtime
WORKDIR /app

# Run as non-root for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
# Free-tier containers only have 512 MB RAM. These settings prevent OOM kills:
# - Workstation GC uses less memory than Server GC
# - Heap hard limit caps .NET's managed heap at 200 MB
# - Disable diagnostics to save memory
ENV DOTNET_gcServer=0
ENV DOTNET_GCHeapHardLimit=0xC800000
ENV DOTNET_EnableDiagnostics=0
EXPOSE 8080

# Render and Docker use this to verify the container is healthy.
# Alpine has wget but not curl.
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

ENTRYPOINT ["dotnet", "CrowdCheck.Api.dll"]
