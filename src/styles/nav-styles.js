import { css } from 'lit';

export default css`
.nav-bar {
  width:0;
  height:100%;
  overflow: hidden;
  color:var(--nav-text-color);
  background-color: var(--nav-bg-color);
  background-blend-mode: multiply;
  line-height: calc(var(--font-size-small) + 4px);
  display:none;
  position:relative;
  flex-direction:column;
  flex-wrap:nowrap;
  word-break:break-word;
}
.nav-scroll {
  overflow-x: hidden;
  overflow-y: auto;
  overflow-y: overlay;
  scrollbar-width: thin;
  scrollbar-color: var(--nav-hover-scrollbar-color) transparent;
}

.nav-bar-tag {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
}

.toggle {
  font-size: 16px;
  cursor: pointer;
  color: var(--nav-text-color);
  transform: translate(-5px, 0px) rotate(0deg);
  transition: transform 0.1s ease;
}

.toggle:hover {
  color:var(--nav-hover-text-color);
}

*.collapsed .toggle {
  transform: translate(-6px, 0px) rotate(-90deg);
}

.nav-bar-tag-and-paths > .nav-bar-section-wrapper {
  max-height: 5000px;
  transition: max-height 1.2s ease-in-out;
  overflow: hidden;
}

.nav-bar-tag-and-paths.collapsed > .nav-bar-section-wrapper {
  transition: max-height 1.2s ease-in-out -1.0s;
  max-height: 0;
}

.nav-bar.focused, .nav-scroll {
  border-top: 1px solid var(--secondary-color);
}
.nav-scroll::-webkit-scrollbar {
  width: 10px;
}
.nav-scroll::-webkit-scrollbar-track {
  background:transparent;
}
.nav-scroll::-webkit-scrollbar-thumb {
  background-color: var(--nav-hover-scrollbar-color);
}

.nav-bar-tag {
  font-size: var(--font-size-regular);
  color: var(--secondary-color);
  border-left:4px solid transparent;
  font-weight:bold;
  padding: 15px 15px 15px 10px; 
}

.nav-bar-components,
.nav-bar-h1,
.nav-bar-h2,
.nav-bar-info, slot[name=nav-section]::slotted(*),
.nav-bar-tag,
.nav-bar-path {
  display:flex;
  cursor: pointer;
  border-left:4px solid transparent;
}

.nav-bar-h1,
.nav-bar-h2,
.nav-bar-path {
  font-size: calc(var(--font-size-regular) - 2px);
  padding: var(--nav-path-padding);
}
.nav-bar-path.small-font {
  font-size: var(--font-size-small);
}

.nav-bar-info, slot[name=nav-section]::slotted(*) {
  font-size: var(--font-size-regular);
  padding: 16px 10px;
  font-weight:bold;
}
.nav-bar-section {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: var(--font-size-small);
  color: var(--nav-text-color);
  padding: 15px 15px 5px 5px;
  font-weight:bold;
  border-bottom: 1px solid var(--nav-text-color);
  background: var(--nav-bg-color);
}
.sticky-scroll-element {
  position: sticky;
  top: 0;
  z-index: 1;
  cursor: pointer;
}

/* .nav-bar-tag has left padding of 10px, so add 10px every time */
.nav-bar-h1 { padding-left: 20px; }
.nav-bar-h2 { padding-left: 30px; }

.nav-bar-h1.active,
.nav-bar-h2.active,
.nav-bar-info.active, slot[name=nav-section]::slotted(*.active),
.nav-bar-tag.active,
.nav-bar-path.active,
.nav-bar-h1.active:hover,
.nav-bar-h2.active:hover,
.nav-bar-info.active:hover, slot[name=nav-section]::slotted(*.active:hover),
.nav-bar-tag.active:hover,
.nav-bar-path.active:hover {
  border-left:4px solid var(--secondary-color);
  color: var(--secondary-color);
  background-color: var(--nav-hover-bg-color);
}

a:focus-visible,
section .nav-bar-path:focus-visible span {
  outline:thin solid var(--secondary-color);
}
section .nav-bar-path:focus-visible span {
  outline-offset: 2px;
}

.nav-bar-h1:focus-visible,
.nav-bar-h2:focus-visible,
.nav-bar-info:focus-visible, slot[name=nav-section]::slotted(*:focus-visible),
.nav-bar-tag:focus-visible,
.nav-bar-path:focus-visible,
.nav-bar-h1:hover,
.nav-bar-h2:hover,
.nav-bar-info:hover, slot[name=nav-section]::slotted(*:hover),
.nav-bar-tag:hover,
.nav-bar-path:hover {
  outline: none;
  color:var(--nav-hover-text-color);
  background-color:var(--nav-hover-bg-color);
}

.nav-bar-h1.active:focus-visible,
.nav-bar-h2.active:focus-visible,
.nav-bar-info.active:focus-visible, slot[name=nav-section]::slotted(*.active:focus-visible),
.nav-bar-tag.active:focus-visible,
.nav-bar-path.active:focus-visible {
  outline:thin solid var(--secondary-color);
}

.conditional-custom-section.custom-section::slotted(*) {
  display: none;
}
.conditional-custom-section.custom-section::slotted(*.active) {
  display: unset !important;
}
`;
