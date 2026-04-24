# Changelog

## 0.3.1 (2026-04-24)

### Features

- Added first-class typing for WebMCP `ToolAnnotations` hints, including `untrustedContentHint`.
- Added `WebMcpToolAnnotations` to the public API exports.
- Added directive support for passing `annotations` via `[webmcpTool]`.

### Documentation

- Updated README examples and guidance to call out setting `untrustedContentHint: true` for untrusted/external content on Chrome 149.0.7810.0+.

## 0.3.0 (2026-03-27)

### Breaking Changes

- **`registerTool()`**: Now accepts a second `options?: { signal?: AbortSignal }` parameter. The returned `AbortController` (or the caller-supplied signal) is used to unregister the tool. Aligns with the WebMCP Mar 27, 2026 spec change.
- **`unregisterTool()` removed**: Use `controller.abort()` on the `AbortController` returned by `registerTool()` instead.
- **`JsonSchemaProperty`**: `oneOf` renamed to `anyOf` to match the updated computed input schema in the WebMCP spec.

### Notes

- `toolparamdescription` for radio/checkbox groups must now be placed on the nearest parent `<fieldset>` element (declarative API browser behaviour change, no library code impact).

## 0.2.1 (2026-03-16)

### Features

- **WebmcpToolRegistrar**: New abstract base class for automatic decorator-based tool registration without a manual constructor call

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
