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

export   const pdfExport = {
    submitButtonLabel: 'publish',
    tabs: [
      {
        title: 'tab.exportGeneral',
        layout: [
          { component: 'FormColumns', fields: ['PageOutput', 'PageSize', 'Orientation', 'Layering', 'OutputIso'] },
          {
            component: 'FieldSet',
            title: 'coloring',
            layout: [
              {
                component: 'FormColumns',
                fields: ['ColorConversion', 'ApplyLineWeights', 'null', 'ForceThinLines']
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
      {
        title: 'tab.exportSecurity',
        layout: [{ component: 'FormSection', fields: ['SecurityPassword', 'PermissionsPassword'] }]
      },
      {
        title: 'tab.exportBannerWatermark',
        layout: [{ component: 'BannerWatermark' }]
      },
      { title: 'tab.exportAction', layout: [{ component: 'FormSection', fields: ['SuccessAction'] }] }
    ]
  };
  
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