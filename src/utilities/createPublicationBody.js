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