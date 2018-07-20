export const elasticSearchDomain = "https://search-kiterope-es-ghpxj2v7tzo6yzryzyfiyeof4i.us-west-1.es.amazonaws.com/";
export const getTheServer = () => {
     if (typeof window !== 'undefined') {
        var path = location.protocol + '//' + location.host + "/"; // (or whatever)
    }
  return path
};
export const theServer = getTheServer();
export const s3IconUrl = "https://kiterope-static.s3.amazonaws.com:443/icons/";
export const s3ImageUrl = "https://kiterope-static.s3.amazonaws.com:443/";
export const s3BaseUrl = "https://kiterope-static.s3.amazonaws.com:443/";


export const TINYMCE_CONFIG = {
  'language'  : 'en',
  'theme'     : 'modern',
  'toolbar'   : 'bold italic underline strikethrough hr | bullist numlist | link unlink | undo redo | spellchecker code',
  'menubar'   : true,
  'statusbar' : true,
  'resize'    : true,
  'plugins'   : 'emoticons template paste textcolor colorpicker textpattern imagetools codesample insertdatetime media nonbreaking save table contextmenu directionality advlist autolink lists link image charmap print preview hr anchor pagebreak searchreplace wordcount visualblocks visualchars code fullscreen',
  'toolbar1'  : 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
  'toolbar2'  : 'print preview media | forecolor backcolor emoticons | codesample ',
  'image_advtab': true,
    'theme_modern_toolbar_location' : 'top',
  'theme_modern_toolbar_align': 'left'
};



export const durations = [
    {value:'1', label: "1 minute"},
    {value:'2', label: "2 minutes"},
    {value:'3', label: "3 minutes"},
    {value:'4', label: "4 minutes"},
    {value:'5', label: "5 minutes"},
    {value:'6', label: "6 minutes"},
    {value:'7', label: "7 minutes"},
    {value:'8', label: "8 minutes"},
    {value:'9', label: "9 minutes"},
    {value:'10', label: "10 minutes"},
    {value:'15', label: "15 minutes"},
    {value:'20', label: "20 minutes"},
    {value:'30', label: "30 minutes"},
    {value:'45', label: "45 minutes"},
    {value:'60', label: "1 hour"},
    {value:'90', label: "1.5 hours"},
    {value:'120', label: "2 hours"},
    {value:'150', label: "2.5 hours"},
    {value:'180', label: "3 hours"},
    ];
export const stepTypeOptions = [
    {value:'COMPLETION', label: "Completion-Based Step"},
    {value:'TIME', label: "Time-Based Step"},
    //{value:'ORDERED_COMPLETION', label: "Ordered, Completion-Based Step"},
    ]
export const visualizationChoices = [
    {value:"SPREADSHEET", label: "Spreadsheet"},
    {value:"LINE", label:"Line Graph"},
    {value:"BAR", label: "Bar Graph"},
]

export const stepOccurrenceTypeOptions = [
    {value:"TODO", label: "To Do"},
    {value:"COMPLETED", label:"Completed"},
    {value:"NEVER_COMPLETED", label:"Never Completed"},

]
export const times = [
    {value:'00:00', label: "12:00 am"},
    {value:'00:30', label: "12:30 am"},
    {value:'01:00', label: "1:00 am"},
    {value:'01:30', label: "1:30 am"},
    {value:'02:00', label: "2:00 am"},
    {value:'02:30', label: "2:30 am"},
    {value:'03:00', label: "3:00 am"},
    {value:'03:30', label: "3:30 am"},
    {value:'04:00', label: "4:00 am"},
    {value:'04:30', label: "4:30 am"},
    {value:'05:00', label: "5:00 am"},
    {value:'05:30', label: "5:30 am"},
    {value:'06:00', label: "6:00 am"},
    {value:'06:30', label: "6:30 am"},
    {value:'07:00', label: "7:00 am"},
    {value:'07:30', label: "7:30 am"},
    {value:'08:00', label: "8:00 am"},
    {value:'08:30', label: "8:30 am"},
    {value:'09:00', label: "9:00 am"},
    {value:'09:30', label: "9:30 am"},
    {value:'10:00', label: "10:00 am"},
    {value:'10:30', label: "10:30 am"},
    {value:'11:00', label: "11:00 am"},
    {value:'11:30', label: "11:30 am"},
    {value:'12:00', label: "12:00 pm"},
    {value:'12:30', label: "12:30 pm"},
    {value:'13:00', label: "1:00 pm"},
    {value:'13:30', label: "1:30 pm"},
    {value:'14:00', label: "2:00 pm"},
    {value:'14:30', label: "2:30 pm"},
    {value:'15:00', label: "3:00 pm"},
    {value:'15:30', label: "3:30 pm"},
    {value:'16:00', label: "4:00 pm"},
    {value:'16:30', label: "4:30 pm"},
    {value:'17:00', label: "5:00 pm"},
    {value:'17:30', label: "5:30 pm"},
    {value:'18:00', label: "6:00 pm"},
    {value:'18:30', label: "6:30 pm"},
    {value:'19:00', label: "7:00 pm"},
    {value:'19:30', label: "7:30 pm"},
    {value:'20:00', label: "8:00 pm"},
    {value:'20:30', label: "8:30 pm"},
    {value:'21:00', label: "9:00 pm"},
    {value:'21:30', label: "9:30 pm"},
    {value:'22:00', label: "10:00 pm"},
    {value:'22:30', label: "10:30 pm"},
    {value:'23:00', label: "11:00 pm"},
    {value:'23:30', label: "11:30 pm"},
    ];


export const customModalStyles = {
    overlay : {

    backgroundColor   : 'rgba(0, 0, 0, 0.75)'
  },

  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    transform             : 'translate(-50%, -50%)',
      overflow                   : 'hidden',

    WebkitOverflowScrolling    : 'touch',
    borderRadius               : '4px',
    outline                    : 'none',
    padding                    : '10px 10px 30px 10px',
  }
};




export const programCategoryOptions = [
    {value:"UNCATEGORIZED", label:"Uncategorized"},
{value:"HEALTH_AND_FITNESS", label:"Health & Fitness"},
{value:"FAMILY", label:"Family"},
{value:"RELATIONSHIPS", label:"Relationships"},
{value:"CAREER",label: "Career"},
{value:"EDUCATION_AND_SKILLS", label:"Education & Skills"},
{value:"MONEY", label:"Money"},

];

export const frequencyOptions = [
     {value:'ONCE', label: "Don't repeat"},
        {value:'HOURLY', label: "Hourly"},
    {value:'DAILY', label: "Daily"},
    {value:'WEEKLY', label: "Weekly"},
    {value:'MONTHLY', label: "Monthly"}];

export const monthlySpecificityOptions = [
     {value:'SPECIFIC_DATES', label: "Specific Dates"},
        {value:'SPECIFIC_DAYS', label: "Specific Days"},
    ];

export const dayOptions = [
     {value:'MONDAY', label: "Monday"},
        {value:'TUESDAY', label: "Tuesday"},
    {value:'WEDNESDAY', label: "Wednesday"},
    {value:'THURSDAY', label: "Thursday"},
    {value:'FRIDAY', label: "Friday"},
{value:'SATURDAY', label: "Saturday"},
{value:'SUNDAY', label: "Sunday"}];

export const monthlyDayOptions = [
     {value:'FIRST', label: "First"},
        {value:'SECOND', label: "Second"},
    {value:'THIRD', label: "Third"},
    {value:'FOURTH', label: "Fourth"},
    {value:'LAST', label: "Last"}]

export const endRecurrenceOptions = [
     {value:'NEVER', label: "Never"},
        {value:'END_DATE', label: "End on"},
    {value:'AFTER_NUMBER_OF_OCCURRENCES', label: "After"},
]

export const programScheduleLengths = [
    {value:'1w', label: "1 week"},
    {value:'2w', label: "2 weeks"},
    {value:'3w', label: "3 weeks"},
    {value:'1m', label: "1 month"},
    {value:'6w', label: "6 weeks"},
    {value:'2m', label: "2 months"},
    {value:'10w', label: "10 weeks"},
    {value:'3m', label: "3 months"},
    {value:'4m', label: "4 months"},
    {value:'5m', label: "5 months"},
    {value:'6m', label: "6 months"},
    {value:'7m', label: "7 months"},
    {value:'8m', label: "8 months"},
    {value:'9m', label: "9 months"},
    {value:'10m', label: "10 months"},
    {value:'11m', label: "11 months"},
    {value:'1y', label: "1 year"}];

export const timeCommitmentOptions = [
    {value:'10m', label: "10 minutes per day"},
    {value:'20m', label: "20 minutes per day"},
    {value:'30m', label: "30 minutes per day"},
    {value:'40m', label: "40 minutes per day"},
    {value:'50m', label: "50 minutes per day"},

    {value:'1h', label: "1 hour per day"},
    {value:'2h', label: "2 hours per day"},
    {value:'3h', label: "3 hours per day"},
    {value:'4h', label: "4 hours per day"},
    {value:'5h', label: "5 hours per day"},
    {value:'8h', label: "8 hours per day"}];

export const costFrequencyMetricOptions = [
    {value:'once', label: "One Time"},
    {value:'month', label: "Per Month"},
    {value:'week', label: "Per Week"},
    {value:'year', label: "Per Year"},
{value:'day', label: "Per Day"}];

export const viewableByOptions = [
    {value:'ONLY_ME', label: "Only me"},
    //{value:'ONLY_CLIENTS', label: "Only my clients"},
    {value:'ANYONE', label: "Anyone"}];

export const userSharingOptions = [
    {value:'ONLY_ME', label: "Only me"},
    //{value:'ONLY_COACHES', label: "Only coaches"},
    //{value:'SHARED_WITH', label: "People I've shared with specifically"},
    {value:'ANYONE', label: "Anyone"}];


export const notificationSendMethodOptions = [
    {value:'APP_TEXT_EMAIL',label: "App, Text, and Email"},
    {value:'APP_TEXT', label:"App and Text"},
    {value:'APP_EMAIL',label:"App and Email"},
    {value:'TEXT_EMAIL', label:"Text and Email"},
    {value:'APP', label:"App Only"},
    {value:'TEXT', label:"Text Only"},
    {value:'EMAIL', label:"Email Only"},
    {value:'NO_NOTIFICATIONS', label: "I don't want any notifications"}
    ];

export const metricFormatOptions = [

    {value: "text", label: "text"},
    {value: "decimal", label: "decimal"},
    {value: "integer", label: "whole number"},
    {value: "time", label: "time"},
    {value: "url", label: "url"},
    {value: "picture", label: "picture"},
    {value: "video", label: "video"},
    {value: "audio", label: "audio"},
];


export const periodOptions = [

    {value: "TODAY", label: "Today"},
    {value: "LAST7", label: "Last 7 Days"},
    {value: "NEXT7", label: "Next 7 Days"},
    {value: "CUSTOM", label: "Custom Range"},
];

export const formats = {
  dateFormat: 'DD',

    dayFormat:'ddd MM/DD'


};

export const customStepModalStyles = {
    overlay : {

    backgroundColor   : 'rgba(0, 0, 0, 0.75)',
                        zIndex: 30,

  },

  content : {
    top                   : '10%',
    left                  : '5%',
    right                 : '5%',
    bottom                : '5%',
    WebkitOverflowScrolling    : 'touch',
    borderRadius               : '4px',
    outline                    : 'none',
    padding                    : '40px',
      paddingTop                :'10px',
  }
};

export const loginJoinModalStyle = {
    overlay : {

    backgroundColor   : 'rgba(0, 0, 0, 0.75)',
        zIndex: 20,
  },

  content : {
    top                   : '10%',
    left                  : '20%',
    right                 : '20%',
    WebkitOverflowScrolling    : 'touch',
    borderRadius               : '4px',
    outline                    : 'none',



  }
};

export const loginJoinModalStyleMobile = {
    overlay : {

    backgroundColor   : 'rgba(0, 0, 0, 0.75)',
        zIndex: 20,
  },

  content : {
    top                   : '15%',
    left                  : '5%',
    right                 : '5%',
    WebkitOverflowScrolling    : 'touch',
    borderRadius               : '4px',
    outline                    : 'none',

  }
};

export const mobileModalStyle = {
    overlay : {

    backgroundColor   : 'rgba(0, 0, 0, 0.75)',
        zIndex: 20,
  },

  content : {
    top                   : '10%',
    left                  : '2%',
    right                 : '2%',
    bottom                : '2%',
    WebkitOverflowScrolling    : 'touch',
    borderRadius               : '4px',
    outline                    : 'none',
    padding                    : '3px',
      paddingTop                :'10px',

  }
};
export const mobileModalStyleHigher = {
    overlay : {

    backgroundColor   : 'rgba(0, 0, 0, 0.75)',
        zIndex: 30,
  },

  content : {
    top                   : '10%',
    left                  : '2%',
    right                 : '2%',
    bottom                : '2%',
    WebkitOverflowScrolling    : 'touch',
    borderRadius               : '4px',
    outline                    : 'none',
    padding                    : '3px',
      paddingTop                :'10px',

  }
};

export const kiteropeColors = {
    color1bg:'#2199E8',
    color1txt: '#FFFFFF',
    color2bg:'#A333C8',
    color2txt:'#FFFFFF',
    color3bg:'#06D6A0',
    color3txt:'#FFFFFF',
    color4bg:'#eb3b49',
    color4txt:'#FFFFFF',



}

export const kiteropeMobileLogo = "https://s3-us-west-1.amazonaws.com/kiterope-static/icons/kiterope_k_logo_v01.png"
    export const kiteropeDesktopLogo = "/static/images/kiterope_logo_v01.png"

export const stepModalStyle = {
    overlay : {

    backgroundColor   : 'rgba(0, 0, 0, 0.75)',
        zIndex: 20,
  },

  content : {
    top                   : '15%',
    left                  : '5%',
    right                 : '5%',
    bottom                : '5%',
    WebkitOverflowScrolling    : 'touch',
    borderRadius               : '4px',
    outline                    : 'none',
    padding                    : '40px',
      paddingTop                :'10px',
  }
};

export const cardPaymentModalStyle = {
    overlay : {

    backgroundColor   : 'rgba(0, 0, 0, 0.75)',
        zIndex: 20,
  },

  content : {
    top                   : '25%',
    left                  : '25%',
    right                 : '25%',
    bottom                : '25%',
    WebkitOverflowScrolling    : 'touch',
    borderRadius               : '4px',
    outline                    : 'none',
    padding                    : '40px',
      paddingTop                :'10px',
  }
};

export const smallDesktopModalStyle = {
    overlay : {

    backgroundColor   : 'rgba(0, 0, 0, 0.75)',
        zIndex: 20,
  },

  content : {
    top                   : '20%',
    left                  : '25%',
    right                 : '25%',
    bottom                : '20%',
    WebkitOverflowScrolling    : 'touch',
    borderRadius               : '4px',
    outline                    : 'none',
    padding                    : '40px',
      paddingTop                :'10px',
  }
};

export const updateModalStyle = {
    overlay : {

    backgroundColor   : 'rgba(0, 0, 0, 0.75)',
                zIndex: 30,

  },

  content : {
    top                   : '15%',
    left                  : '30%',
    right                 : '30%',
    bottom                : '10%',

    WebkitOverflowScrolling    : 'touch',
    borderRadius               : '4px',
    outline                    : 'none',
    padding                    : '30px 30px 30px 30px',
  }
};

export const updateModalStyleHigher = {
    overlay : {

    backgroundColor   : 'rgba(0, 0, 0, 0.75)',
                zIndex: 30,

  },

  content : {
    top                   : '15%',
    left                  : '30%',
    right                 : '30%',
    bottom                : '10%',

    WebkitOverflowScrolling    : 'touch',
    borderRadius               : '4px',
    outline                    : 'none',
    padding                    : '30px 30px 30px 30px',
  }
};

export const defaultUserCroppableImage = {
    id: 214,
    image: "https://s3-us-west-1.amazonaws.com/kiterope-static/uploads/user.svg",
    originalUncompressedImage: "https://s3-us-west-1.amazonaws.com/kiterope-static/uploads/user.svg",
    cropperCropboxData:""

}

export const defaultGoalCroppableImage = {
    id: 215,
    image: "https://s3-us-west-1.amazonaws.com/kiterope-static/uploads/goalItem.png",
    originalUncompressedImage: "https://s3-us-west-1.amazonaws.com/kiterope-static/uploads/goalItem.png",
    cropperCropboxData:""

}

export const defaultStepCroppableImage = {
    id: 216,
    image: "https://s3-us-west-1.amazonaws.com/kiterope-static/uploads/stepDefaultImage.png",
    originalUncompressedImage: "https://s3-us-west-1.amazonaws.com/kiterope-static/uploads/stepDefaultImage.png",
    cropperCropboxData:""

}

export const defaultProgramCroppableImage = {
    id: 217,
    image: "https://s3-us-west-1.amazonaws.com/kiterope-static/uploads/planDefault.png",
    originalUncompressedImage: "https://s3-us-west-1.amazonaws.com/kiterope-static/uploads/planDefault.png",
    cropperCropboxData:""

}

export const subscribeModalStyle = {
    overlay : {

    backgroundColor   : 'rgba(0, 0, 0, 0.75)'
  },

  content : {
    top                   : '10%',
    left                  : '5%',
    right                 : '5%',
    bottom                : '5%',
    WebkitOverflowScrolling    : 'touch',
    borderRadius               : '4px',
    outline                    : 'none',
    padding                    : '40px',
      paddingTop:'40px'
  }
};
function printObject(o) {
  var out = '';
  for (var p in o) {
    out += p + ': ' + o[p] + '\n';
  }
  alert(out);
}



export const selectImageStyle = {
             overflow: 'hidden',
             display: 'block',
             backgroundColor: '#2199e8',
             color: 'white',
             border: '1px solid #2199e8',
             borderRadius: '4px',
             position: 'relative',
             cursor: 'pointer',
             textAlign: 'center',

             fontWeight: 'bold',
             width: '225px',
             height: '50px'
         }

export const cropImageStyle = {
             overflow: 'hidden',
             display: 'block',
             backgroundColor: '#2199e8',
             color: 'white',
             fontSize: '1rem',
             border: '1px solid #2199e8',
             borderRadius: '4px',
             position: 'relative',
             cursor: 'pointer',
             textAlign: 'center',
             lineHeight: "50px",

             fontWeight: 'bold',
             width: '400px',
             height: '50px',
         }



module.exports = {   kiteropeColors, kiteropeMobileLogo, kiteropeDesktopLogo, mobileModalStyle, smallDesktopModalStyle, cardPaymentModalStyle, updateModalStyleHigher, endRecurrenceOptions, dayOptions, monthlyDayOptions, monthlySpecificityOptions, defaultProgramCroppableImage, loginJoinModalStyleMobile, mobileModalStyleHigher, loginJoinModalStyle, defaultStepCroppableImage, defaultUserCroppableImage, defaultGoalCroppableImage, selectImageStyle, cropImageStyle, theServer, s3BaseUrl, periodOptions, stepModalStyle, visualizationChoices, s3IconUrl, programCategoryOptions, s3ImageUrl, updateModalStyle, customModalStyles, frequencyOptions, programScheduleLengths, timeCommitmentOptions, costFrequencyMetricOptions, viewableByOptions, formats, customStepModalStyles,
    TINYMCE_CONFIG, times, durations, userSharingOptions, subscribeModalStyle, stepOccurrenceTypeOptions, notificationSendMethodOptions,metricFormatOptions, stepTypeOptions, elasticSearchDomain };