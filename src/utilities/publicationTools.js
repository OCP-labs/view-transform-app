export const createPublicationBody = (filename, mimeType, blobId) => {
    const publicationBody = 
    {
        publicationVersion: "1.x",
        policy: {
            namespace: "opentext.publishing.brava",
            name: "SimpleBravaView",
            version: "1.x"
        },
        tags: [
            {
                dev: "on-demand"
            }
        ],
        featureSettings: [
            {
                feature: {
                    namespace: "opentext.publishing.sources",
                    name: "LoadSources"
                },
                path: "/documents",
                value: [
                    {
                        url: `https://css.us.api.opentext.com/v3/files/${blobId}/stream`,
                        formatHint: mimeType,
                        filenameHint: filename
                    }
                ]
            },
            {
                feature: {
                    namespace: "opentext.publishing.execution",
                    name: "SetPublishingTarget",
                    version: "1.x"
                },
                path: "/publishingTarget",
                value: "css-v3://upload?authzPolicy=delegateToSource"
            }
        ]
    }
    return publicationBody;
}

export const xmlRedactionScriptString = '<?xml version="1.0" encoding="UTF-8"?><RedactionScript version="1"><RedactionCommand comment="SSN" hyperlink="developer.opentext.com"><SearchString string="[:ssn:]" matchWholeWord="false"/></RedactionCommand><RedactionCommand comment="Credit Card" hyperlink="developer.opentext.com"><SearchString string="[:creditcard:]" matchWholeWord="false"/></RedactionCommand></RedactionScript>'

export const createRedactedPublicationBody = (filename, mimeType, blobId, encodedXmlString) => {
    const publicationBody = 
    {
        policy: {
            name: "CouldBeAnything",
            namespace: "opentext.publishing",
            version: "1.x"
        },
        publicationVersion: "1.x",
        tags: [
            {
                dev: "on-demand"
            }
        ],
        featureSettings: [
            {
                feature: {
                    name: "LoadSources",
                    namespace: "opentext.publishing.sources"
                },
                path: "/documents",
                value: [{
                    filenameHint: filename,
                    formatHint: mimeType,
                    url: `https://css.us.api.opentext.com/v3/files/${blobId}/stream`
                }]
            }, 
            {
                feature: {
                    name: "DeleteAfterCompletion",
                    namespace: "opentext.publications.execution",
                    version: "1.x"
                },
                path: "/timeInMilliseconds",
                value: 43200000
            }, 
            {
                feature: {
                    name: "SetPublishingTarget",
                    namespace: "opentext.publishing.execution",
                    version: "1.x"
                },
                path: "/publishingTarget",
                value: "css-v3://upload?authzPolicy=delegateToSource"
            }, 
            {
                feature: {
                    name: "ExportPdf",
                    namespace: "opentext.publishing.renditions",
                    version: "4.x"
                },
                path: "/requestedVersion",
                value: "1.7"
            }, 
            {
                feature: {
                    name: "ExportPdf",
                    namespace: "opentext.publishing.renditions",
                    version: "4.x"
                },
                path: "/isoConformance",
                value: "none"
            }, 
            {
                feature: {
                    name: "ApplyRedactionScripts",
                    namespace: "opentext.publishing.content",
                    version: "1.x"
                },
                path: "/scripts",
                value: [{
                    uri: `data:text/xml;base64,${encodedXmlString}`
                }]
            }
        ]
    }
    return publicationBody;
}

export const getDownloadUrlFromPublication = (publicationJson, redactedVersion) => {
    console.log(publicationJson);    
    const createDownloadUrl = (obj) => {
      const urlTemplate = redactedVersion ? obj._embedded["pa:get_publication_artifacts"][2]._embedded["ac:get_artifact_content"].urlTemplate : obj._embedded["pa:get_publication_artifacts"][0]._embedded["ac:get_artifact_content"].urlTemplate;
      const id = redactedVersion ? obj._embedded["pa:get_publication_artifacts"][2]._embedded["ac:get_artifact_content"].contentLinks[0].id :  obj._embedded["pa:get_publication_artifacts"][0]._embedded["ac:get_artifact_content"].contentLinks[0].id;
      const url = urlTemplate.replace(/\{id\}/, id);
      return url;
    }
    const url = createDownloadUrl(publicationJson);
    console.log(url);
    return url;
}