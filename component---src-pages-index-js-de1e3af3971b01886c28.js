"use strict";(self.webpackChunkmy_personal_blog=self.webpackChunkmy_personal_blog||[]).push([[678],{6558:function(e,t,l){l.r(t),l.d(t,{Head:function(){return m}});var n=l(7294),a=l(1883),r=l(2914),o=l(9357);const c=["NodeJS","ReactJS","NextJS","Python","MongoDB","Linux","Docker","Log"];t.default=e=>{let{data:t,pageContext:{locale:l,titleByLang:o}}=e;console.log(o);const m=t.allMarkdownRemark.nodes,{0:s,1:i}=(0,n.useState)("");return 0===m.length?n.createElement(n.Fragment,null,n.createElement(r.Z,{locale:l}),n.createElement("p",null,"No blog posts found.")):n.createElement(n.Fragment,null,n.createElement(r.Z,{locale:l}),n.createElement("div",{className:"blog-tag-list-container"},c.map(((e,t)=>n.createElement("button",{key:e+t,onClick:()=>(e=>{i(e!==s?e:"")})(e),className:e===s?"active-tag":""},e)))),n.createElement("ol",{style:{listStyle:"none"}},m.filter((e=>!s||s===e.frontmatter.tag)).map((e=>{const t=e.frontmatter.title||e.fields.slug;return n.createElement("li",{key:e.fields.slug},n.createElement("article",{className:"post-list-item",itemScope:!0,itemType:"http://schema.org/Article"},n.createElement("header",null,n.createElement("h2",null,n.createElement(a.Link,{to:e.fields.slug,itemProp:"url"},n.createElement("span",{itemProp:"headline"},t))),n.createElement("p",null,n.createElement("span",null,e.frontmatter.tag)),n.createElement("small",null,e.frontmatter.date)),n.createElement("section",null,n.createElement("p",{dangerouslySetInnerHTML:{__html:e.frontmatter.description||e.excerpt},itemProp:"description"}))))}))))};const m=()=>n.createElement(o.Z,{title:"All posts"})}}]);
//# sourceMappingURL=component---src-pages-index-js-de1e3af3971b01886c28.js.map