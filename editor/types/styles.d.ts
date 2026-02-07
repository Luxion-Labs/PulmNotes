// Declarations for style imports used across the project
// Prevents `Cannot find module or type declarations for side-effect import` errors

declare module '*.scss';
declare module '*.css';

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
