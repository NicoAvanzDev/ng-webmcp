# Changelog

## 0.2.0 (2026-03-12)

### Breaking Changes

- **JsonSchemaProperty**: Removed `title` field to align with the WebMCP spec removal of the `toolparamtitle` HTML attribute (Mar 12, 2026 changelog). Use `description` for parameter descriptions.
- **ModelContextApi**: `provideContext` and `clearContext` methods were removed from the spec (Mar 6, 2026 changelog) and were never included in this library.

## 0.1.0 (2026-03-07)

### Features

- **WebmcpService**: Core service with `registerTool`, `unregisterTool`, `isSupported` signal, automatic cleanup via `DestroyRef`
- **@WebmcpTool decorator**: Method decorator for declarative tool registration on services
- **WebmcpToolDirective**: Attribute directive for component-level tool registration tied to DOM lifecycle
- **WebmcpModule**: NgModule with `forRoot()` configuration
- **provideWebmcp()**: Standalone provider function for modern Angular apps
- **WEBMCP_CONFIG**: Injection token for library configuration (logLevel, fallbackBehavior)
- **ng-webmcp/testing**: Secondary entry point with `installWebMcpPolyfill()` for development/testing
- SSR safe: All `navigator` access guarded with `isPlatformBrowser()`
- Tree-shakeable: Standalone components, no barrel-file side effects
- Zero runtime dependencies beyond `@angular/core`
