import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import '../components/api-request.js';
import '../components/api-response.js';
import codeSamplesTemplate from './code-samples-template.js';
import callbackTemplate from './callback-template.js';
import { pathSecurityTemplate } from './security-scheme-template.js';
import { getCurrentElement, pathIsInSearch, replaceState, toMarkdown } from '../utils/common-utils.js';
import { getI18nText } from '../languages/index.js';

function toggleExpand(path) {
  if (path.expanded) {
    path.expanded = false;
    replaceState(null);
  } else {
    path.expanded = true;
    this.emitOperationChangedEvent(path.elementId);

    // Toggle all the other ones off
    this.resolvedSpec.tags.forEach(t => t.paths.filter(p => p.elementId !== path.elementId).forEach(p => p.expanded = false));
    if (path.elementId !== getCurrentElement()) {
      replaceState(path.elementId);
    }
  }
  this.requestUpdate();
}

function toggleTag(tagElement, tagId) {
  const tag = this.resolvedSpec.tags.find(t => t.elementId === tagId);
  tag.expanded = !tag.expanded;
  this.requestUpdate();
}
export function expandCollapseAll(currentElement, expand) {
  this.resolvedSpec.tags.forEach(t => t.expanded = expand);
  this.requestUpdate();
}

export function expandCollapseComponent(component) {
  component.expanded = !component.expanded;
  this.requestUpdate();
}

/* eslint-disable indent */
function endpointHeadTemplate(path) {
  return html`
  <summary @click="${(e) => { toggleExpand.call(this, path, e); }}" class='endpoint-head ${path.method} ${path.expanded ? 'expanded' : 'collapsed'}'>
    <div class="method ${path.method}" role="heading" aria-level="3"><span style="line-height: 1;">${path.method}</span></div> 
    <div style="${path.deprecated ? 'text-decoration: line-through;' : ''}">
      ${this.usePathInNavBar
        ? html`<div class="path">${path.path.split('/').filter(t => t.trim()).map(t => html`<span>/${t}</span>`)}</div>`
        : html`<div class="">${path.summary || path.shortSummary}</div>`
      }
      ${path.isWebhook ? html`<span style="color:var(--primary-color)"> (${getI18nText('operations.webhook')}) </span>` : ''}
    </div>
  </summary>
  `;
}

function endpointBodyTemplate(path) {
  // Filter API Keys that are non-empty and are applicable to the the path
  const nonEmptyApiKeys = this.resolvedSpec.securitySchemes.filter((v) => (v.finalKeyValue && path.security?.some((ps) => ps[v.apiKeyId]))) || [];

  const codeSampleTabPanel = path.xCodeSamples ? codeSamplesTemplate(path.xCodeSamples) : '';
  return html`
  <div class='endpoint-body ${path.method}'>
    <div class="summary">
      ${this.usePathInNavBar
        ? path.summary ? html`<div class="title" role="heading" aria-level="1">${path.summary}<div>` : path.shortSummary !== path.description ? html`<div class="title" role="heading" aria-level="1">${path.shortSummary}</div>` : ''
        : html`
          <div class='title mono-font regular-font-size' part="section-operation-url" style='display: flex; flex-wrap: wrap; color:var(--fg3)'> 
            ${path.isWebhook ? html`<span style="color:var(--primary-color)">${getI18nText('operations.webhook')}</span>` : ''}
            <span part="label-operation-method" class='regular-font upper method-fg bold-text ${path.method}'>${path.method}&nbsp;</span> 
            <span style="display: flex; flex-wrap: wrap;" part="label-operation-path">${path.path.split('/').filter(t => t.trim()).map(t => html`<span>/${t}</span>`)}</span>
          </div>`
      }
      ${path.description ? html`<div class="m-markdown"> ${unsafeHTML(toMarkdown(path.description))}</div>` : ''}
      <slot name="${path.elementId}"></slot>
      <slot name="path-details" data-method="${path.method}" data-path="${path.path}"></slot>
      ${pathSecurityTemplate.call(this, path.security)}
      ${codeSampleTabPanel}
    </div>  
    <div class='req-resp-container'> 
      <div style="display:flex; flex-direction:column" class="request">
        <api-request class="request-panel"
          style = "width:100%;"
          method = "${path.method}", 
          path = "${path.path}" 
          element-id = "${path.elementId}"
          .parameters = "${path.parameters}"
          .request_body = "${path.requestBody}"
          .api_keys = "${nonEmptyApiKeys}"
          .servers = "${path.servers}"
          server-url = "${path.servers?.[0]?.url || this.selectedServer?.computedUrl}" 
          active-schema-tab = "${this.defaultSchemaTab}"
          fill-defaults = "${!this.hideDefaults}"
          display-nulls="${!!this.includeNulls}"
          enable-console = "${!this.hideExecution}"
          render-style="${this.renderStyle}" 
          schema-style="${this.displaySchemaAsTree ? 'tree' : 'table'}"
          schema-expand-level = "${this.schemaExpandLevel}"
          schema-hide-read-only = "${this.schemaHideReadOnly}"
          fetch-credentials = "${this.fetchCredentials}"
          @scrollToSchemaComponentByName=${v => this.scrollToSchemaComponentByName(v)}
          exportparts="btn, btn-fill, btn-outline, btn-try, schema-key, schema-type, schema-description, schema-table-header">
        </api-request>
      </div>
      ${path.callbacks ? callbackTemplate.call(this, path.callbacks) : ''}
      <api-response  
        class="request response" 
        .responses="${path.responses}"
        display-nulls="${!!this.includeNulls}"
        active-schema-tab = "${this.defaultSchemaTab}" 
        render-style="${this.renderStyle}" 
        schema-style="${this.displaySchemaAsTree ? 'tree' : 'table'}"
        schema-expand-level = "${this.schemaExpandLevel}"
        schema-hide-write-only = "${this.schemaHideWriteOnly}"
        selected-status = "${Object.keys(path.responses || {})[0] || ''}"
        @scrollToSchemaComponentByName=${v => this.scrollToSchemaComponentByName(v)}
        exportparts = "btn--resp, btn-fill--resp, btn-outline--resp, schema-key, schema-type, schema-description, schema-table-header"
      > </api-response>
    </div>
  </div>`;
}

export default function endpointTemplate() {
  return html`
    <div style="display:flex; justify-content:flex-end; padding-right: 1rem; font-size: 14px; margin-top: 16px;"> 
      <span @click="${(e) => expandCollapseAll.call(this, e, true)}" style="color:var(--primary-color); cursor: pointer;">Expand</span> 
      &nbsp;|&nbsp; 
      <span @click="${(e) => expandCollapseAll.call(this, e, false)}" style="color:var(--primary-color); cursor: pointer;">Collapse</span>
    </div>
    ${(this.resolvedSpec && this.resolvedSpec.tags || []).map((tag) => html`
    <div class='regular-font method-section-gap section-tag ${tag.expanded ? 'expanded' : 'collapsed'}'> 
    
      <div class='section-tag-header' @click="${(e) => toggleTag.call(this, e, tag.elementId)}">
        <div id='${tag.elementId}' class="sub-title tag" role="heading" aria-level="2" style="color:var(--primary-color)">${tag.name}</div>
      </div>
      <div class='section-tag-body'>
        <slot name="${tag.elementId}"></slot>
        ${tag.description
          ? html`
          <div class="regular-font regular-font-size m-markdown description" style="padding-bottom:12px">
            ${unsafeHTML(toMarkdown(tag.description || ''))}
          </div>`
        : ''
        }
        ${tag.paths.filter((v) => pathIsInSearch(this.matchPaths, v)).map((path) => html`
          <section id='${path.elementId}' class='m-endpoint regular-font ${path.method} ${path.expanded ? 'expanded' : 'collapsed'}'>
            ${endpointHeadTemplate.call(this, path)}      
            ${path.expanded ? endpointBodyTemplate.call(this, path) : ''}
          </section>`)
        }
      </div>
    </div>
  `)
  }`;
}
/* eslint-enable indent */
