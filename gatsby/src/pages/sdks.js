import React, { useState } from 'react'
import { graphql } from 'gatsby'

import Helmet from 'react-helmet'
import { Layout, MXContentMain, MXProjectCard } from '../components'
import config from '../../config'
import MDXRenderer from 'gatsby-mdx/mdx-renderer'

const _ = require('lodash')

const SDKs = ({ data }) => {
  const sdks = data.allFile.edges.filter(s =>
    s.node.childMdx &&
    s.node.childMdx.frontmatter.categories &&
    s.node.childMdx.frontmatter.categories[0] === 'sdk' &&
    s.node.childMdx.frontmatter.maturity !== "Not actively maintained"
  ).map((edge => {
    var result = edge.node.childMdx.frontmatter;
    result.slug = edge.node.childMdx.fields.slug;
    result.body = edge.node.childMdx.body;
    return result;
  }));

  var [selected, setSelected] = useState(sdks[0]);

  const clickHandler = (el) => {
    setSelected(sdks.find(s => s.slug == el.target.dataset["sdk"]));
  };

  const selectItemRender = (sdk) => {
    return (
      <div style={selected && sdk.slug === selected.slug ? { "background": "#f4f4f4", "fontWeight": "bold" } : {}}
        data-sdk={sdk.slug}
        key={"selector_" + sdk.slug}
        onClick={clickHandler}>
        {sdk.title} <small data-sdk={sdk.slug}>({sdk.language})</small>
      </div>
    )
  }

  const languages = [
    ["Python", ["Python"]],
    ["JavaScript", ["JavaScript", "TypeScript"]],
    ["Go", ["Go"]],
    ["Rust", ["Rust"]],
    ["Ruby", ["Ruby"]],
    ["Java", ["Java"]],
    ["Objective-C", ["Objective-C"]],
    ["Dart", ["Dart"]],
    ["Perl", ["Perl"]],
  ]
  return (<Layout navmode="discover">
    <MXContentMain>
      <Helmet title={`SDKs | ${config.siteTitle}`} />
      <h1 id="SDKs">SDKs</h1>
      <div className="mxgrid">
        <div className="mxgrid__item25">
          {
            languages.map(l => {
              return(<div>
                <h3>{l[0]}</h3>
                {
            sdks
              .filter(s => s.featured)
              .filter(s => l[1].includes(s.language))
              .map(selectItemRender)}
                </div>);
            })
          }
          <h3>Other</h3>
          {
            sdks
              .filter(s => s.featured)
              .filter(s => !languages.flat().flat().includes(s.language))
              .map(selectItemRender)}
        </div>

        <div className="mxgrid__item50">{
          selected &&
          <div>
            <h2>{selected.title}</h2>
            <div>
              <div style={{ "float": "left" }}>
                <a href={selected.slug}>{selected.title} on matrix.org</a><br />
                <a href={selected.repo}>{selected.repo}</a><br />
                <a href={"https://matrix.to/#/" + selected.room}>{selected.room}</a>

              </div>
              <div style={{ "float": "left" }}>
                <img alt={selected.title} src={selected.thumbnail}
                  style={{ "maxWidth": `${100}px`, "maxHeight": `${100}px` }} />
              </div>
              <br clear="all" />
            </div>
            <MDXRenderer>{selected.body}</MDXRenderer>
          </div>
        }
        </div>

      </div>

    </MXContentMain>
  </Layout>)
}


export const query = graphql`
{
    allFile(
      sort: {fields:childMdx___frontmatter___sort_order, order: ASC}
      filter: { sourceInstanceName: { eq: "projects" } }) {
        edges {
            node {
                childMdx {
                    frontmatter {
                        title
                        maturity
                        description
                        thumbnail
                        featured
                        categories
                        language
                        author
                        repo
                        room
                        e2e
                        slug
                        sort_order
                    }
                    fields {
                      slug
                    }
                    body
                }
            }
        }
    }
}
`
export default SDKs
