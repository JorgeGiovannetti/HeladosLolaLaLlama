import React from "react";
import { useColorMode } from "@chakra-ui/react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./date-picker.css";
import es from "date-fns/locale/es";

registerLocale("es", es);

const ChakraDatePicker = ({
  selectedDate,
  onChange,
  isClearable = false,
  showPopperArrow = false,
  ...props
}) => {
  const isLight = useColorMode().colorMode === "light";

  return (
    <div className={isLight ? "light-theme" : "dark-theme"}>
      <DatePicker
        showPopperArrow={showPopperArrow}
        selected={selectedDate}
        onChange={onChange}
        isClearable={isClearable}
        className="react-datapicker__input-text"
        locale="es"
        dateFormat={"dd/MM/yyyy"}
        {...props}
      />
    </div>
  );
};

export default ChakraDatePicker;
