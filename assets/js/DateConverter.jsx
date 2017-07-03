import moment from 'moment';

function printObject(o) {
  var out = '';
  for (var p in o) {
    out += p + ': ' + o[p] + '\n';
  }
  alert(out);
}

function convertDate(baseDate, numberOfDaysDifference, returnFormat, shouldConvertOffset) {
        var baseDateInMomentForm = moment(baseDate)
        var baseDateInDateForm = new Date(baseDate)

        var momentTimezoneOffset = moment.parseZone(baseDateInMomentForm).utcOffset()
        var dateTimezoneOffset = baseDateInDateForm.getTimezoneOffset();

        var calculatedDateInMomentForm = moment(baseDateInMomentForm, "MM-DD-YYYY").add(numberOfDaysDifference, 'days')
        var calculatedDateInDateForm = calculatedDateInMomentForm.toDate()
    var calculatedComputerReadableStringFormatted = calculatedDateInMomentForm.format("YYYY-MM-DD")
    var calculatedHumanReadableStringFormatted = calculatedDateInMomentForm.format("MM-DD-YYYY")

        var calculatedAndConvertedInMomentForm = moment.utc(calculatedDateInMomentForm).utcOffset(momentTimezoneOffset)
        var calculatedAndConvertedInDateForm = new Date(calculatedDateInDateForm.getTime() + dateTimezoneOffset * 60 * 1000)


            var baseDateInMomentFormatted = baseDateInMomentForm.format()
    var calculatedDateInMomentFormatted = calculatedDateInMomentForm.format()
    var calculatedAndConvertedInMomentFormatted = calculatedAndConvertedInMomentForm.format()
    var calculatedAndConvertedComputerReadableStringFormatted = calculatedAndConvertedInMomentForm.format("YYYY-MM-DD")
    var calculatedAndConvertedHumanReadableStringFormatted = calculatedAndConvertedInMomentForm.format("MM-DD-YYYY")


        var theObject = {
            baseDateInMomentFormatted: baseDateInMomentFormatted,
            baseDateInDateForm: baseDateInDateForm,
            momentTimezoneOffset: momentTimezoneOffset,
            dateTimezoneOffset: dateTimezoneOffset,
            calculatedDateInMomentFormatted: calculatedDateInMomentFormatted,
            calculatedDateInDateForm: calculatedDateInDateForm,
            calculatedAndConvertedInMomentFormatted: calculatedAndConvertedInMomentFormatted,
            calculatedAndConvertedInDateForm: calculatedAndConvertedInDateForm


        }
                //printObject(theObject)
    var returnOptions = returnFormat + " " + shouldConvertOffset
        switch(returnOptions) {
            case("momentFormat relativeTime"):
                return calculatedAndConvertedInMomentForm;
                break;
            case("momentFormat absoluteTime"):
                return calculatedDateInMomentForm;
                break;
            case("dateFormat relativeTime"):
                return calculatedAndConvertedInDateForm;
                break;
            case("dateFormat absoluteTime"):
                return calculatedDateInDateForm;
                break;
            case("stringFormatHuman relativeTime"):
                return calculatedAndConvertedHumanReadableStringFormatted;
                break;
            case("stringFormatComputer relativeTime"):
                return calculatedAndConvertedComputerReadableStringFormatted;
                break;
            case("stringFormatHuman absoluteTime"):
                return calculatedHumanReadableStringFormatted;
                break;
            case("stringFormatComputer absoluteTime"):
                return calculatedAndConvertedComputerReadableStringFormatted;
                break;
            default:
                return "There were no correct format options"


        }

        return calculatedAndConvertedInDateForm




}

function convertFromDateString(baseDateString, numberOfDaysDifference, returnFormat, shouldConvertOffset) {
        var baseDateInMomentForm = moment(baseDateString)
        var baseDateInDateForm = new Date(baseDateString)

        var momentTimezoneOffset = moment.parseZone(baseDateInMomentForm).utcOffset()
        var dateTimezoneOffset = baseDateInDateForm.getTimezoneOffset();

        var calculatedDateInMomentForm = moment(baseDateInMomentForm, "MM-DD-YYYY").add(numberOfDaysDifference, 'days')
        var calculatedDateInDateForm = calculatedDateInMomentForm.toDate()

        var calculatedAndConvertedInMomentForm = moment.utc(calculatedDateInMomentForm).utcOffset(momentTimezoneOffset)
        var calculatedAndConvertedInDateForm = new Date(calculatedDateInDateForm.getTime() + dateTimezoneOffset * 60 * 1000)

            var baseDateInMomentFormatted = baseDateInMomentForm.format()
    var calculatedDateInMomentFormatted = calculatedDateInMomentForm.format()
    var calculatedAndConvertedInMomentFormatted = calculatedAndConvertedInMomentForm.format()

        var theObject = {
            baseDateInMomentFormatted: baseDateInMomentFormatted,
            baseDateInDateForm: baseDateInDateForm,
            momentTimezoneOffset: momentTimezoneOffset,
            dateTimezoneOffset: dateTimezoneOffset,
            calculatedDateInMomentFormatted: calculatedDateInMomentFormatted,
            calculatedDateInDateForm: calculatedDateInDateForm,
            calculatedAndConvertedInMomentFormatted: calculatedAndConvertedInMomentFormatted,
            calculatedAndConvertedInDateForm: calculatedAndConvertedInDateForm
        }
        //printObject(theObject)
    return calculatedAndConvertedInDateForm

}

function daysBetweenDates(baseDate, theDate) {
    var baseDateInMomentForm = moment(baseDate)
    var theDateInMomentForm = moment(theDate)

    var differenceInDays = theDateInMomentForm.diff(baseDateInMomentForm, 'days');
    return differenceInDays

}

function daysBetween(startDate, endDate) {
    var millisecondsPerDay = 24 * 60 * 60 * 1000;
    return (endDate - startDate) / millisecondsPerDay;
}

function convertStringDateFormatToDateFormat (events) {
          //var currentTime = moment();
          //var utcOffset = moment.parseZone(currentTime).utcOffset();
          var todaysDate = new Date()
          var tzDifference = todaysDate.getTimezoneOffset();
          //new Date(targetTime.getTime() + tzDifference * 60 * 1000)
          var i=0
          var theEvents = events
          for (i=0; i < events.length; i++) {
              var absoluteStartDateInDateForm = new Date(events[i].absoluteStartDate)
              var absoluteEndDateInDateForm = new Date(events[i].absoluteEndDate)


              theEvents[i].absoluteStartDate = new Date(absoluteStartDateInDateForm.getTime() + tzDifference * 60 * 1000)
              theEvents[i].absoluteEndDate = new Date(absoluteEndDateInDateForm.getTime() + tzDifference * 60 * 1000)
          }
          return theEvents

      }


module.exports = { convertDate, convertFromDateString, daysBetweenDates , convertStringDateFormatToDateFormat, daysBetween }