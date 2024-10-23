export const toolbarWithMarkupStuff = {
    left: [
      { component: 'ToggleSidebarButton', side: 'tabContainerWithMarkups' },
      { component: 'DownloadButton' },
      { component: 'PanButton' },
      { component: 'ZoomToRectangleButton' },
      { component: 'SaveButton' },
      { component: 'ZoomInButton' },
      { component: 'ZoomOutButton' },
      { component: 'ZoomExtentsButton' },
      { component: 'ZoomWidthButton' },
      { component: 'RotateButton' },
      { component: 'ExportButton', format: 'pdf' },
      // TODO: add tiff export button
      { component: 'ExportButton', format: 'tiff' }
    ],
    center: [{ component: 'TitleText' }],
    right: [
      { component: 'PageSelector', style: { marginLeft: '0.5em' } },
      { component: 'CloseButton', size: 18 }
    ]
};
  
export const tabContainerWithMarkups = {
    sidebarName: 'tabContainerWithMarkups',
    primary: 'primary',
    tabs: [
        { component: 'ThumbnailPane', title: 'tab.thumbnails' },
        { component: 'MarkupPane', title: 'tab.markups', layoutKey: 'markupTools' },
    ]
};

export const createTabContainer = (fullToolbarNeeded) => {
    const tabContainer = {
        sidebarName: 'tabContainerWithMarkups',
        primary: 'primary',
        tabs: [
            { component: 'ThumbnailPane', title: 'tab.thumbnails' },
        ]
    }
    if (fullToolbarNeeded) {
        tabContainer.tabs.push({ component: 'MarkupPane', title: 'tab.markups', layoutKey: 'markupTools' });
    }
    return tabContainer;
}

export const pdfExportActions = [
    { id: 'download', default: true, message: 'Download to my browser' }
]

export const pdfExportDefaults = {
    pageSizeName: '',
    pagesToExport: 'all',
    markupBurnin: 'burn',
    colorConversion: 'original',
    isoConformance: 'none',
    successAction: 'download',
    includeLayers: 'all',
    rotateToOrientation: 'original',
}

export const pdfExport = {
    submitButtonLabel: 'publish',
    tabs: [
      {
        title: 'tab.exportGeneral',
        layout: [
          { component: 'FormColumns', fields: ['PageOutput', 'PageSize', 'Orientation', 'Layering', 'OutputIso'] },
          {
            component: 'FieldSet',
            title: 'markup',
            toggle: 'includeMarkups',
            layout: [
              {
                component: 'FormColumns',
                fields: ['BurninMarkups', 'AppendComments', 'MarkupsAsComments', 'AppendReasons']
              }
            ]
          }
        ]
      },
      { title: 'tab.exportAction', layout: [{ component: 'FormSection', fields: ['SuccessAction'] }] }
    ]
};

// TODO: Add tiff exports
export const tiffExportDefaults = {
    successAction: 'download',
    pagesToExport: 'all',
    colorConversion: 'original',
    compressionType: 'lzw',
    dotsPerInch: 200,
    bitsPerPixel: 'max24bpp',
    rotateToOrientation: 'portrait'
};

export const tiffExport = {
    submitButtonLabel: 'publish',
    tabs: [
      {
        title: 'tab.exportGeneral',
        layout: [
          { component: 'FormColumns', fields: ['PageOutput', 'Orientation', 'Compression', 'DotsPerInch'] },
          {
            component: 'FieldSet',
            title: 'coloring',
            layout: [
              {
                component: 'FormColumns',
                fields: ['ColorConversion', 'ColorDepth', 'ApplyLineWeights', 'null', 'ForceThinLines']
              }
            ]
          },
          {
            component: 'FieldSet',
            title: 'markup',
            toggle: 'includeMarkups',
            layout: [
              {
                component: 'FormColumns',
                fields: ['BurninMarkups', 'AppendComments', 'MarkupsAsComments', 'AppendReasons']
              }
            ]
          }
        ]
      },
      { title: 'tab.exportAction', layout: [{ component: 'FormSection', fields: ['SuccessAction'] }] }
    ]
};

export const exportOptions = {
    pageOutputOptions: [
        { value: 'all' }, 
        { value: 'current' }, 
        { value: 'markup' }, 
        { value: 'designated' }
    ],
    pageSizeOptions: [
        { value: '', label: 'Original page size' },
        { value: 'Letter', label: 'Letter (8.5 X 11 in)' },
        { value: 'Legal', label: 'Legal (8.5 X 14 in.)' },
        { value: 'Ledger', label: 'Ledger (17 X 11 in.)' },
        { value: 'Tabloid', label: 'Tabloid (11 X 17 in.)' },
        { value: 'Executive', label: 'Executive (7.25 x 10.55 in.)' },
        { value: 'Arch C Size Sheet', label: 'Arch C Size Sheet (24 X 18 in.)' },
        { value: 'Arch D Size Sheet', label: 'Arch D Size Sheet (36 X 24 in.)' },
        { value: 'Arch E Size Sheet', label: 'Arch E Size Sheet (48 X 36 in.)' },
        { value: 'Ansi C Size Sheet', label: 'Ansi C Size Sheet (22 X 17 in.)' },
        { value: 'Ansi D Size Sheet', label: 'Ansi D Size Sheet (34 X 22 in.)' },
        { value: 'Ansi E Size Sheet', label: 'Ansi E Size Sheet (44 X 34 in.)' },
        { value: 'ISO A0 Landscape', label: 'ISO A0 Landscape (1189 X 841 mm)' },
        { value: 'ISO A1 Landscape', label: 'ISO A1 Landscape (841 X 594 mm)' },
        { value: 'ISO A2 Landscape', label: 'ISO A2 Landscape (594 X 420 mm)' },
        { value: 'ISO A3 Landscape', label: 'ISO A3 Landscape (420 X 297 mm)' },
        { value: 'ISO A4 Landscape', label: 'ISO A4 Landscape (297 X 210 mm)' },
        { value: 'ISO A5 Landscape', label: 'ISO A5 Landscape (210 X 148 mm)' },
        { value: 'ISO A6 Landscape', label: 'ISO A6 Landscape (148 X 105 mm)' },
        { value: 'ISO A7 Landscape', label: 'ISO A7 Landscape (105 X 74 mm)' },
        { value: 'ISO A0 Portrait', label: 'ISO A0 Portrait (841 X 1189 mm)' },
        { value: 'ISO A1 Portrait', label: 'ISO A1 Portrait (594 X 841 mm)' },
        { value: 'ISO A2 Portrait', label: 'ISO A2 Portrait (420 X 594 mm)' },
        { value: 'ISO A3 Portrait', label: 'ISO A3 Portrait (297 X 420 mm)' },
        { value: 'ISO A4 Portrait', label: 'ISO A4 Portrait (210 X 297 mm)' },
        { value: 'ISO A5 Portrait', label: 'ISO A5 Portrait (148 X 210 mm)' },
        { value: 'ISO A6 Portrait', label: 'ISO A6 Portrait (105 X 148 mm)' },
        { value: 'ISO A7 Portrait', label: 'ISO A7 Portrait (74 X 105 mm)' },
        { value: 'ISO B0 Landscape', label: 'ISO B0 Landscape (1414 X 1000 mm)' },
        { value: 'ISO B1 Landscape', label: 'ISO B1 Landscape (1000 X 707 mm)' },
        { value: 'ISO B2 Landscape', label: 'ISO B2 Landscape (707 X 500 mm)' },
        { value: 'ISO B3 Landscape', label: 'ISO B3 Landscape (500 X 353 mm)' },
        { value: 'ISO B4 Landscape', label: 'ISO B4 Landscape (353 X 250 mm)' },
        { value: 'ISO B5 Landscape', label: 'ISO B5 Landscape (250 X 176 mm)' },
        { value: 'ISO B6 Landscape', label: 'ISO B6 Landscape (176 X 125 mm)' },
        { value: 'ISO B7 Landscape', label: 'ISO B7 Landscape (125 X 88 mm)' },
        { value: 'ISO B0 Portrait', label: 'ISO B0 Portrait (1000 X 1414 mm)' },
        { value: 'ISO B1 Portrait', label: 'ISO B1 Portrait (707 X 1000 mm)' },
        { value: 'ISO B2 Portrait', label: 'ISO B2 Portrait (500 X 707 mm)' },
        { value: 'ISO B3 Portrait', label: 'ISO B3 Portrait (353 X 500 mm)' },
        { value: 'ISO B4 Portrait', label: 'ISO B4 Portrait (250 X 353 mm)' },
        { value: 'ISO B5 Portrait', label: 'ISO B5 Portrait (176 X 250 mm)' },
        { value: 'ISO B6 Portrait', label: 'ISO B6 Portrait (125 X 176 mm)' },
        { value: 'ISO B7 Portrait', label: 'ISO B7 Portrait (88 X 125 mm)' },
        { value: 'JIS B4', label: 'JIS B4 (364 X 257 mm)' },
        { value: 'JIS B5', label: 'JIS B5 (182 X 257 mm)' }
    ],
    isoOptions: [
        { label: 'PDF Standard', value: 'none' },
        { label: 'PDF/A-1a compatible', value: 'a1a' },
        { label: 'PDF/A-1b compatible', value: 'a1b' },
        { label: 'PDF/A-2b compatible', value: 'a2b' },
        { label: 'PDF/A-2u compatible', value: 'a2u' },
        { label: 'PDF/A-3a compatible', value: 'a3a' },
        { label: 'PDF/A-3b compatible', value: 'a3b' },
        { label: 'PDF/A-3u compatible', value: 'a3u' },
        { label: 'PDF/E compatible', value: 'e' }
    ],
    orientationOptions: [
        { value: 'original' },
        { value: 'portrait' },
        { value: 'landscape' },
        { value: 'outputsize' }
    ],
    layerOptions: [
        { value: 'all' }, 
        { value: 'visible' }, 
        { value: 'none' }
    ]
}
  
export const markupTools = [
    {
        title: 'Tools',
        tools: [
            {
                label: 'select markup',
                tool: 'select',
                icon: 'Select'
            }
        ]
    },
    {
        title: 'toolPalette.annotations',
        tools: [
            { label: 'text', tool: 'text', icon: 'Text', props: {} },
            { label: 'arrow', tool: 'arrow', icon: 'Arrow', props: {} },
            { label: 'ellipse', tool: 'ellipse', icon: 'Ellipse', props: {} },
            { label: 'arc', tool: 'arc', icon: 'Arc', props: {} },
            { label: 'scratchout', tool: 'scratchout', icon: 'Scratchout', props: {} },
            { label: 'cloudRectangle', tool: 'cloudRectangle', icon: 'CloudRectangle', props: {} },
            { label: 'cloudPolygon', tool: 'cloudPolygon', icon: 'CloudPolygon', props: {} },
            { label: 'openSketch', tool: 'openSketch', icon: 'OpenSketch' },
            { label: 'closedSketch', tool: 'closedSketch', icon: 'ClosedSketch' },
            { label: 'line', tool: 'line', icon: 'Line', props: {} },
            {
                label: 'polyline',
                tool: 'polyline',
                icon: 'Polyline',
                props: { closed: false }
            },
            { label: 'crossout', tool: 'crossout', icon: 'Crossout', props: {} },
            { label: 'rectangle', tool: 'rectangle', icon: 'Rectangle', props: {} },
            {
                label: 'polygon',
                tool: 'polygon',
                icon: 'Polygon',
                props: { closed: true }
            },
            {
                label: 'highlight',
                tool: 'highlight',
                icon: 'Highlight'
            },
            {
                label: 'roundedRectangle',
                tool: 'roundedRectangle',
                icon: 'RoundedRectangle'
            },
            {
                label: 'changemark',
                tool: 'changemark',
                icon: 'Changemark',
                props: { fill: '#f05822dd' } // OpenText "Burnt" color
            },
            {
                label: 'raster',
                tool: 'raster',
                icon: 'Raster'
            },
            {
                label: 'stamp',
                tool: 'stamp',
                icon: 'Stamp'
            }
        ]
    },
    {
        title: 'toolPalette.text',
        tools: [
            {
                label: 'textScratch',
                tool: 'textScratch',
                icon: 'TextScratchout'
            },
            {
                label: 'textUnderline',
                tool: 'textUnderline',
                icon: 'TextUnderline'
            },
            {
                label: 'textStrike',
                tool: 'textStrike',
                icon: 'TextStrikeThrough'
            },
            {
                label: 'textHighlight',
                tool: 'textHighlight',
                icon: 'TextHighlight'
            }
        ]
    },
    {
        title: 'toolPalette.redactions',
        tools: [
            {
                label: 'redactionRectangle',
                tool: 'redactionRectangle',
                icon: 'RedactArea'
            },
            {
                label: 'redactionText',
                tool: 'redactionText',
                icon: 'RedactText'
            },
            {
                label: 'peekRectangle',
                tool: 'peekRectangle',
                icon: 'RedactPeek'
            }
        ]
    }
];