import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { Command as Command$1, useCommandState } from "cmdk";
import { X } from "lucide-react";
import * as React from "react";
import { useMemo, useEffect, useCallback, forwardRef } from "react";
import { B as Badge } from "./badge-DFvO9DkX.js";
import { C as CommandItem, a as Command, b as CommandList, c as CommandGroup } from "./command-5HTd1Hbk.js";
import { q as cn } from "./router-DU5jczZR.js";
import { u as useDebounce } from "./use-debounce-B6NKG3k-.js";
const EMPTY_ARRAY = [];
function transToGroupOption(options, groupBy) {
  if (options.length === 0) {
    return {};
  }
  if (!groupBy) {
    return {
      "": options
    };
  }
  const groupOption = {};
  options.forEach((option) => {
    const key = option[groupBy] || "";
    if (!groupOption[key]) {
      groupOption[key] = [];
    }
    groupOption[key].push(option);
  });
  return groupOption;
}
function removePickedOption(groupOption, picked) {
  const cloneOption = JSON.parse(JSON.stringify(groupOption));
  for (const [key, value] of Object.entries(cloneOption)) {
    cloneOption[key] = value.filter(
      (val) => !picked.find((p) => p.value === val.value)
    );
  }
  return cloneOption;
}
function isOptionsExist(groupOption, targetOption) {
  for (const [, value] of Object.entries(groupOption)) {
    if (value.some((option) => targetOption.find((p) => p.value === option.value))) {
      return true;
    }
  }
  return false;
}
const CommandEmpty = forwardRef(({ className, ...props }, forwardedRef) => {
  const render = useCommandState((state) => state.filtered.count === 0);
  if (!render) return null;
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: forwardedRef,
      className: cn("py-6 text-center text-sm", className),
      "cmdk-empty": "",
      role: "presentation",
      ...props
    }
  );
});
CommandEmpty.displayName = "CommandEmpty";
const MultipleSelector = React.forwardRef(
  ({
    value,
    onChange,
    placeholder,
    defaultOptions: arrayDefaultOptions = EMPTY_ARRAY,
    options: arrayOptions,
    delay,
    onSearch,
    onSearchSync,
    loadingIndicator,
    emptyIndicator,
    maxSelected = Number.MAX_SAFE_INTEGER,
    onMaxSelected,
    hidePlaceholderWhenSelected,
    disabled,
    groupBy,
    className,
    badgeClassName,
    selectFirstItem = true,
    creatable = false,
    triggerSearchOnFocus = false,
    commandProps,
    inputProps,
    hideClearAllButton = false
  }, ref) => {
    const inputRef = React.useRef(null);
    const [open, setOpen] = React.useState(false);
    const [onScrollbar, setOnScrollbar] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const dropdownRef = React.useRef(null);
    const [selected, setSelected] = React.useState(
      value || EMPTY_ARRAY
    );
    const [options, setOptions] = React.useState(
      transToGroupOption(arrayDefaultOptions, groupBy)
    );
    const [inputValue, setInputValue] = React.useState("");
    const debouncedSearchTerm = useDebounce(inputValue, delay || 500);
    const selectedValue = useMemo(() => {
      return {
        selectedValue: [...selected],
        input: inputRef.current,
        focus: () => inputRef?.current?.focus(),
        reset: () => setSelected([])
      };
    }, [selected]);
    React.useImperativeHandle(ref, () => selectedValue, [selectedValue]);
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && inputRef.current && !inputRef.current.contains(event.target)) {
        setOpen(false);
        inputRef.current.blur();
      }
    };
    const handleUnselect = React.useCallback(
      (option) => {
        const newOptions = selected.filter((s) => s.value !== option.value);
        setSelected(newOptions);
        onChange?.(newOptions);
      },
      [onChange, selected]
    );
    const handleKeyDown = React.useCallback(
      (e) => {
        const input = inputRef.current;
        if (input) {
          if (e.key === "Delete" || e.key === "Backspace") {
            if (input.value === "" && selected.length > 0) {
              const lastSelectOption = selected[selected.length - 1];
              if (lastSelectOption && !lastSelectOption.fixed) {
                handleUnselect(lastSelectOption);
              }
            }
          }
          if (e.key === "Escape") {
            input.blur();
          }
        }
      },
      [handleUnselect, selected]
    );
    useEffect(() => {
      if (open) {
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchend", handleClickOutside);
      } else {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("touchend", handleClickOutside);
      }
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("touchend", handleClickOutside);
      };
    }, [open]);
    useEffect(() => {
      if (value) {
        setSelected(value);
      }
    }, [value]);
    useEffect(() => {
      if (!arrayOptions || onSearch) {
        return;
      }
      const newOption = transToGroupOption(
        arrayOptions || EMPTY_ARRAY,
        groupBy
      );
      if (JSON.stringify(newOption) !== JSON.stringify(options)) {
        setOptions(newOption);
      }
    }, [arrayDefaultOptions, arrayOptions, groupBy, onSearch, options]);
    useEffect(() => {
      const doSearchSync = () => {
        const res = onSearchSync?.(debouncedSearchTerm);
        setOptions(transToGroupOption(res || [], groupBy));
      };
      const exec = async () => {
        if (!onSearchSync || !open) return;
        if (triggerSearchOnFocus) {
          doSearchSync();
        }
        if (debouncedSearchTerm) {
          doSearchSync();
        }
      };
      void exec();
    }, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus]);
    useEffect(() => {
      const doSearch = async () => {
        setIsLoading(true);
        const res = await onSearch?.(debouncedSearchTerm);
        setOptions(transToGroupOption(res || [], groupBy));
        setIsLoading(false);
      };
      const exec = async () => {
        if (!onSearch || !open) return;
        if (triggerSearchOnFocus) {
          await doSearch();
        }
        if (debouncedSearchTerm) {
          await doSearch();
        }
      };
      void exec();
    }, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus]);
    const handleCommandKeyDown = useCallback(
      (e) => {
        handleKeyDown(e);
        commandProps?.onKeyDown?.(e);
      },
      [handleKeyDown, commandProps]
    );
    const handleBadgeGroupClick = useCallback(() => {
      if (disabled) return;
      inputRef?.current?.focus();
    }, [disabled]);
    const targetOption = useMemo(() => {
      return [{ value: inputValue, label: inputValue }];
    }, [inputValue]);
    const handleCommandItemMouseDown = useCallback(
      (e) => {
        e.preventDefault();
        e.stopPropagation();
      },
      []
    );
    const handleCommandItemSelect = useCallback(
      (value2) => {
        if (selected.length >= maxSelected) {
          onMaxSelected?.(selected.length);
          return;
        }
        setInputValue("");
        const newOptions = [...selected, { value: value2, label: value2 }];
        setSelected(newOptions);
        onChange?.(newOptions);
      },
      [maxSelected, onMaxSelected, selected, onChange]
    );
    const CreatableItem = () => {
      if (!creatable) return void 0;
      if (isOptionsExist(options, targetOption) || selected.find((s) => s.value === inputValue)) {
        return void 0;
      }
      const Item = /* @__PURE__ */ jsx(
        CommandItem,
        {
          value: inputValue,
          className: "cursor-pointer",
          onMouseDown: handleCommandItemMouseDown,
          onSelect: handleCommandItemSelect,
          children: `Create "${inputValue}"`
        }
      );
      if (!onSearch && inputValue.length > 0) {
        return Item;
      }
      if (onSearch && debouncedSearchTerm.length > 0 && !isLoading) {
        return Item;
      }
      return void 0;
    };
    const EmptyItem = React.useCallback(() => {
      if (!emptyIndicator) return void 0;
      if (onSearch && !creatable && Object.keys(options).length === 0) {
        return /* @__PURE__ */ jsx(CommandItem, { value: "-", disabled: true, children: emptyIndicator });
      }
      return /* @__PURE__ */ jsx(CommandEmpty, { children: emptyIndicator });
    }, [creatable, emptyIndicator, onSearch, options]);
    const selectables = React.useMemo(
      () => removePickedOption(options, selected),
      [options, selected]
    );
    const commandFilter = React.useCallback(() => {
      if (commandProps?.filter) {
        return commandProps.filter;
      }
      if (creatable) {
        return (value2, search) => {
          return value2.toLowerCase().includes(search.toLowerCase()) ? 1 : -1;
        };
      }
      return void 0;
    }, [creatable, commandProps?.filter]);
    const handlePrimitiveInputValueChange = useCallback(
      (value2) => {
        setInputValue(value2);
        inputProps?.onValueChange?.(value2);
      },
      [inputProps]
    );
    const handlePrimitiveInputBlur = useCallback(
      (event) => {
        if (!onScrollbar) {
          setOpen(false);
        }
        inputProps?.onBlur?.(event);
      },
      [onScrollbar, inputProps]
    );
    const handlePrimitiveInputFocus = useCallback(
      (event) => {
        setOpen(true);
        if (triggerSearchOnFocus) {
          onSearch?.(debouncedSearchTerm);
        }
        inputProps?.onFocus?.(event);
      },
      [triggerSearchOnFocus, debouncedSearchTerm, inputProps, onSearch]
    );
    const handleClearAllButtonClick = useCallback(() => {
      setSelected(selected.filter((s) => s.fixed));
      onChange?.(selected.filter((s) => s.fixed));
    }, [selected, onChange]);
    const handleCommandListMouseLeave = useCallback(() => {
      setOnScrollbar(false);
    }, []);
    const handleCommandListMouseEnter = useCallback(() => {
      setOnScrollbar(true);
    }, []);
    const handleCommandListMouseUp = useCallback(() => {
      inputRef?.current?.focus();
    }, []);
    const handleCommandGroupItemMouseDown = useCallback(
      (e) => {
        e.preventDefault();
        e.stopPropagation();
      },
      []
    );
    const handleCommandGroupItemSelect = useCallback(
      (option) => {
        if (selected.length >= maxSelected) {
          onMaxSelected?.(selected.length);
          return;
        }
        setInputValue("");
        const newOptions = [...selected, option];
        setSelected(newOptions);
        onChange?.(newOptions);
      },
      [maxSelected, onMaxSelected, selected, onChange]
    );
    return /* @__PURE__ */ jsxs(
      Command,
      {
        ref: dropdownRef,
        ...commandProps,
        onKeyDown: handleCommandKeyDown,
        className: cn(
          "h-auto overflow-visible bg-transparent",
          commandProps?.className
        ),
        shouldFilter: commandProps?.shouldFilter !== void 0 ? commandProps.shouldFilter : !onSearch,
        filter: commandFilter(),
        children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: cn(
                "min-h-10 rounded-md border border-input text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                {
                  "px-3 py-2": selected.length !== 0,
                  "cursor-text": !disabled && selected.length !== 0
                },
                className
              ),
              onClick: handleBadgeGroupClick,
              children: /* @__PURE__ */ jsxs("div", { className: "relative flex flex-wrap gap-1", children: [
                selected.map((option) => {
                  return /* @__PURE__ */ jsx(
                    OptionBadge,
                    {
                      option,
                      onUnselect: handleUnselect,
                      badgeClassName,
                      disabled
                    },
                    option.value
                  );
                }),
                /* @__PURE__ */ jsx(
                  Command$1.Input,
                  {
                    ...inputProps,
                    ref: inputRef,
                    value: inputValue,
                    disabled,
                    onValueChange: handlePrimitiveInputValueChange,
                    onBlur: handlePrimitiveInputBlur,
                    onFocus: handlePrimitiveInputFocus,
                    placeholder: hidePlaceholderWhenSelected && selected.length !== 0 ? "" : placeholder,
                    className: cn(
                      "flex-1 bg-transparent outline-none placeholder:text-muted-foreground",
                      {
                        "w-full": hidePlaceholderWhenSelected,
                        "px-3 py-2": selected.length === 0,
                        "ml-1": selected.length !== 0
                      },
                      inputProps?.className
                    )
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: handleClearAllButtonClick,
                    className: cn(
                      "absolute right-0 h-6 w-6 p-0",
                      (hideClearAllButton || disabled || selected.length < 1 || selected.filter((s) => s.fixed).length === selected.length) && "hidden"
                    ),
                    children: /* @__PURE__ */ jsx(X, {})
                  }
                )
              ] })
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "relative", children: open && /* @__PURE__ */ jsx(
            CommandList,
            {
              className: "absolute top-1 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in",
              onMouseLeave: handleCommandListMouseLeave,
              onMouseEnter: handleCommandListMouseEnter,
              onMouseUp: handleCommandListMouseUp,
              children: isLoading ? /* @__PURE__ */ jsx(Fragment, { children: loadingIndicator }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                EmptyItem(),
                CreatableItem(),
                !selectFirstItem && /* @__PURE__ */ jsx(CommandItem, { value: "-", className: "hidden" }),
                Object.entries(selectables).map(([key, dropdowns]) => /* @__PURE__ */ jsx(
                  CommandGroup,
                  {
                    heading: key,
                    className: "h-full overflow-auto",
                    children: /* @__PURE__ */ jsx(Fragment, { children: dropdowns.map((option) => {
                      return /* @__PURE__ */ jsx(
                        CommandGroupItem,
                        {
                          option,
                          onSelect: handleCommandGroupItemSelect,
                          onMouseDown: handleCommandGroupItemMouseDown
                        },
                        option.value
                      );
                    }) })
                  },
                  key
                ))
              ] })
            }
          ) })
        ]
      }
    );
  }
);
MultipleSelector.displayName = "MultipleSelector";
const OptionBadge = ({
  option,
  onUnselect,
  badgeClassName,
  disabled
}) => {
  const handleUnselect = useCallback(() => {
    onUnselect(option);
  }, [onUnselect, option]);
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        onUnselect(option);
      }
    },
    [onUnselect, option]
  );
  const handleMouseDown = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
    },
    []
  );
  return /* @__PURE__ */ jsxs(
    Badge,
    {
      className: cn(
        "data-disabled:bg-muted-foreground data-disabled:text-muted data-disabled:hover:bg-muted-foreground",
        "data-fixed:bg-muted-foreground data-fixed:text-muted data-fixed:hover:bg-muted-foreground",
        badgeClassName
      ),
      "data-fixed": option.fixed,
      "data-disabled": disabled || void 0,
      children: [
        option.label,
        /* @__PURE__ */ jsx(
          "button",
          {
            className: cn(
              "ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2",
              (disabled || option.fixed) && "hidden"
            ),
            onKeyDown: handleKeyDown,
            onMouseDown: handleMouseDown,
            onClick: handleUnselect,
            children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3 text-muted-foreground hover:text-foreground" })
          }
        )
      ]
    },
    option.value
  );
};
const CommandGroupItem = ({
  option,
  onSelect,
  onMouseDown
}) => {
  const handleSelect = useCallback(() => {
    onSelect(option);
  }, [onSelect, option]);
  return /* @__PURE__ */ jsx(
    CommandItem,
    {
      value: option.value,
      disabled: option.disable,
      onMouseDown,
      onSelect: handleSelect,
      className: cn(
        "cursor-pointer",
        option.disable && "cursor-default text-muted-foreground"
      ),
      children: option.label
    },
    option.value
  );
};
export {
  MultipleSelector as M
};
