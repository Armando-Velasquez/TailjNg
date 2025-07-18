/*
 * Public API Surface of tailjng
 */

// ========================================
// Config
// ========================================
export * from './lib/config/tailjng-config.token';


// ========================================
// Services
// ========================================

// Crud
export * from './lib/services/crud/converter-crud.service';
export * from './lib/services/crud/generic-crud.service';

// Http
export * from './lib/services/http/params-http.service';
export * from './lib/services/http/error-handler-http.service';

// Transformer
export * from './lib/services/transformer/calendar.service';

// Static
export * from './lib/services/static/icons.service';
export * from './lib/services/static/theme.service';

// Alert
export * from './lib/services/alert/dialog-alert.service';
export * from './lib/services/alert/toast-alert.service';


// Interface
export * from './lib/interfaces/crud/crud.interface';

// npm version patch
// npm run build


// cd dist/tailjng
// npm publish --access public

// npx tailjng add [component]