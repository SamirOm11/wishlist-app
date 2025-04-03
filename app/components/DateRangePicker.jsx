import {
    Button,
    Card,
    DatePicker,
    Divider,
    InlineStack,
    OptionList,
    Popover,
    TextField,
  } from "@shopify/polaris";
  import { CalendarIcon } from "@shopify/polaris-icons";
  import { useEffect, useState } from "react";
  
  const rangeToDatesMap = {
    TODAY: {
      start: (() => {
        const d = new Date();
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        return d;
      })(),
      end: new Date(),
    },
    YESTERDAY: {
      start: (() => {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        return d;
      })(),
      end: (() => {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        d.setHours(23);
        d.setMinutes(59);
        d.setSeconds(59);
        return d;
      })(),
    },
    LAST_7: {
      start: (() => {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        return d;
      })(),
      end: new Date(),
    },
    LAST_30: {
      start: (() => {
        const d = new Date();
        d.setDate(d.getDate() - 30);
        return d;
      })(),
      end: new Date(),
    },
    LAST_90: {
      start: (() => {
        const d = new Date();
        d.setDate(d.getDate() - 90);
        return d;
      })(),
      end: new Date(),
    },
    LAST_MONTH: {
      start: (() => {
        const d = new Date();
        d.setMonth(d.getMonth() - 1);
        d.setDate(1);
        return d;
      })(),
      end: (() => {
        const d = new Date();
        d.setMonth(d.getMonth() - 1);
        d.setDate(new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate());
        return d;
      })(),
    },
    LAST_YEAR: {
      start: (() => {
        const d = new Date();
        d.setFullYear(d.getFullYear() - 1);
        d.setMonth(0);
        d.setDate(1);
        return d;
      })(),
      end: (() => {
        const d = new Date();
        d.setFullYear(d.getFullYear() - 1);
        d.setMonth(11);
        d.setDate(31);
        return d;
      })(),
    },
  };
  
  const formatDate = (date, options) => {
    if (options)
      return new Intl.DateTimeFormat(options.locale, options.format).format(date);
  
    const dateFormatter = new Intl.DateTimeFormat("en-IN", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
    const dateStrings = dateFormatter.format(date).split("/").reverse();
    const month =
      Number(dateStrings[1]) < 10 ? "0" + dateStrings[1] : dateStrings[1];
    const day =
      Number(dateStrings[2]) < 10 ? "0" + dateStrings[2] : dateStrings[2];
    return `${dateStrings[0]}-${month}-${day}`;
  };
  
  const rangeLabelMap = {
    TODAY: "Today",
    YESTERDAY: "Yesterday",
    LAST_7: "Last 7 Days",
    LAST_30: "Last 30 Days",
    LAST_90: "Last 90 Days",
    LAST_MONTH: "Last month",
    LAST_YEAR: "Last year",
  };
  
  const ranges = [
    {
      label: "Today",
      value: "TODAY",
    },
    {
      label: "Yesterday",
      value: "YESTERDAY",
    },
    {
      label: "Last 7 Days",
      value: "LAST_7",
    },
    {
      label: "Last 30 Days",
      value: "LAST_30",
    },
    {
      label: "Last 90 Days",
      value: "LAST_90",
    },
    {
      label: "Last month",
      value: "LAST_MONTH",
    },
    {
      label: "Last year",
      value: "LAST_YEAR",
    },
  ];
  
  const defaultRange = "LAST_30";
  const getDatesFromRange = (range) => rangeToDatesMap[range];
  const isDateRangeValid = (dates) => {
    return !(dates?.start > dates?.end);
  };
  
  /**
   *
   *
   * DateRangePicker component uses polaris component to show user
   * attractive UI to pick date range.
   *
   * Maintain your own state for selectedDates and for selected range code.
   * Pass the selectedDates to startDate and endDate. Also pass the range which the dates are at.
   *
   *
   * @param {Function} onSubmit - Function that is invoked when user selects a Date range and hits apply.
   * It returns the selected dates of the range and the range code ("LAST_30","LAST_90","LAST_MONTH",....) the  It resets the date range to last 30 days.
   * @param {Function} onCancel - Funtion that is invoked when user clicks on cancel button. It resets the date range to last 30 days
   * @param {Date} startDate - The date to start from
   * @param {Date} endDate - Then end date of the range
   * @returns {React.ReactNode} - Returns JSX component
   *
   *
   */
  
  export default function DateRangePicker({
    onSubmit,
    onCancel,
    startDate,
    endDate,
    range,
  }) {
    const now = new Date();
    const [disabled, setDisabled] = useState(false);
    const [showDateRangePickerModal, setShowDateRangePickerModal] =
      useState(false);
  
    const [selectedRange, setSelectedRange] = useState({
      label: rangeLabelMap[defaultRange],
      value: defaultRange,
    });
  
    const [selectedDates, setSelectedDates] = useState(
      getDatesFromRange(defaultRange),
    );
  
    const [{ month, year }, setMonthAndYear] = useState({
      month: now.getMonth(),
      year: now.getFullYear(),
    });
  
    const handlePopoverClose = () => {
      setShowDateRangePickerModal(false);
    };
  
    const handlePopoverOpen = () => {
      setShowDateRangePickerModal((prev) => !prev);
    };
  
    const handleOptionChange = (newSelectedRange) => {
      setSelectedDates(getDatesFromRange(newSelectedRange[0]));
      setSelectedRange({
        label: rangeLabelMap[newSelectedRange[0]],
        value: newSelectedRange[0],
      });
    };
  
    const handleSelectedDatesChange = (newDates) => {
      setSelectedRange({ label: rangeLabelMap["CUSTOM"], value: "CUSTOM" });
      setSelectedDates(newDates);
    };
  
    const handleDateInputChange = (newDate, key) => {
      setSelectedRange({
        label: rangeLabelMap["CUSTOM"],
        value: "CUSTOM",
      });
  
      const d = new Date(newDate);
      setSelectedDates((prev) => ({
        ...prev,
        [key]: d.toString() !== "Invalid Date" ? d : prev[key],
      }));
    };
  
    const handleMonthChange = (month, year) => {
      setMonthAndYear({ month, year });
    };
  
    const handleSubmit = () => {
      handlePopoverClose();
      onSubmit &&
        typeof onSubmit === "function" &&
        onSubmit({ range: selectedRange, selectedDates });
    };
  
    const handleCancel = () => {
      handlePopoverClose();
      onCancel && typeof onCancel === "function" && onCancel();
    };
  
    useEffect(() => {
      if (startDate && endDate) {
        setSelectedDates({ start: startDate, end: endDate });
        if (range)
          setSelectedRange({ label: rangeLabelMap[range], value: range });
        else
          setSelectedRange({ label: rangeLabelMap["CUSTOM"], value: "CUSTOM" });
      } else setSelectedDates(getDatesFromRange(defaultRange));
    }, [startDate, endDate]);
  
    useEffect(() => {
      setDisabled(!isDateRangeValid(selectedDates));
      setMonthAndYear({
        month: selectedDates.start.getMonth(),
        year: selectedDates.start.getFullYear(),
      });
    }, [selectedDates]);
  
    return (
      <div style={{ minWidth: "600px", width: "600px" }}>
        <Popover
          preferredAlignment="left"
          active={showDateRangePickerModal}
          fluidContent={true}
          activator={
            <Button onClick={handlePopoverOpen} icon={CalendarIcon}>
              {selectedRange.label}
            </Button>
          }
          onClose={handlePopoverClose}
        >
          <Card>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ minWidth: "150px" }}>
                <OptionList
                  title=""
                  onChange={handleOptionChange}
                  options={ranges}
                  selected={selectedRange.value}
                />
              </div>
              <div
                style={{
                  maxWidth: "500px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <InlineStack gap={300} blockAlign="center">
                  <TextField
                    id="start"
                    type="date"
                    value={formatDate(selectedDates?.start)}
                    onChange={handleDateInputChange}
                  />
                  <TextField
                    id="end"
                    type="date"
                    onChange={handleDateInputChange}
                    value={formatDate(selectedDates?.end)}
                  />
                </InlineStack>
                <DatePicker
                  month={month}
                  year={year}
                  onChange={handleSelectedDatesChange}
                  onMonthChange={handleMonthChange}
                  selected={selectedDates}
                  multiMonth
                  allowRange
                />
              </div>
            </div>
  
            <Divider />
  
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "end",
                gap: "1rem",
                marginTop: "0.8rem",
              }}
            >
              <Button disabled={disabled} onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                disabled={disabled}
                onClick={handleSubmit}
                variant="primary"
              >
                Apply
              </Button>
            </div>
          </Card>
        </Popover>
      </div>
    );
  }
  