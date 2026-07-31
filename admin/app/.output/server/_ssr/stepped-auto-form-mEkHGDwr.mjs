import { jsxs, jsx } from "react/jsx-runtime";
import React__default, { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { A as AutoForm } from "./index-zHebWDbP.mjs";
import { B as Button, q as cn$1 } from "./router-qu_5GP1h.mjs";
import { S as Separator } from "./separator-dOz0oFNG.mjs";
import { Z as ZodObject, o as object } from "../_libs/zod.mjs";
function extractStepsFromSchema(schema) {
  try {
    const jsonSchema = schema.toJSONSchema();
    if (jsonSchema.steps && Array.isArray(jsonSchema.steps)) {
      return jsonSchema.steps;
    }
  } catch {
  }
  return [];
}
function getFieldStepAssignments(schema) {
  const assignments = /* @__PURE__ */ new Map();
  try {
    const jsonSchema = schema.toJSONSchema();
    const stepGroupMap = jsonSchema.stepGroupMap;
    if (stepGroupMap) {
      for (const [fieldName, stepGroup] of Object.entries(stepGroupMap)) {
        assignments.set(fieldName, stepGroup);
      }
      return assignments;
    }
    const properties = jsonSchema.properties;
    if (properties) {
      for (const [fieldName, fieldSchema] of Object.entries(properties)) {
        const stepGroup = fieldSchema.stepGroup;
        if (typeof stepGroup === "number") {
          assignments.set(fieldName, stepGroup);
        } else {
          assignments.set(fieldName, 0);
        }
      }
    }
  } catch {
  }
  return assignments;
}
function createStepSchema(fullSchema, stepIndex, fieldAssignments) {
  const fieldsForStep = Array.from(fieldAssignments.entries()).filter(([, step]) => step === stepIndex).map(([field]) => field);
  if (fieldsForStep.length === 0) {
    return object({});
  }
  const pickObject = {};
  for (const field of fieldsForStep) {
    pickObject[field] = true;
  }
  return fullSchema.pick(pickObject);
}
function getObjectSchema(schema) {
  if (schema instanceof ZodObject) {
    return schema;
  }
  const schemaDef = schema._zod?.def ?? schema._def;
  if (schemaDef) {
    if (schemaDef.schema) {
      return getObjectSchema(schemaDef.schema);
    }
    if (schemaDef.innerType) {
      return getObjectSchema(schemaDef.innerType);
    }
  }
  return null;
}
function DefaultStepper({
  steps,
  currentStepIndex,
  onStepClick
}) {
  return /* @__PURE__ */ jsx("nav", { "aria-label": "Form Steps", className: "mb-6", children: /* @__PURE__ */ jsx("ol", { className: "flex items-center justify-between gap-2", children: steps.map((step, index) => /* @__PURE__ */ jsxs(React__default.Fragment, { children: [
    /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2 shrink-0", children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          type: "button",
          variant: index <= currentStepIndex ? "default" : "secondary",
          "aria-current": currentStepIndex === index ? "step" : void 0,
          "aria-posinset": index + 1,
          "aria-setsize": steps.length,
          className: "size-10 rounded-full p-0",
          onClick: () => onStepClick?.(step.id),
          children: index + 1
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "text-sm font-medium hidden sm:inline", children: step.label })
    ] }),
    index < steps.length - 1 && /* @__PURE__ */ jsx(
      Separator,
      {
        className: cn$1(
          "flex-1 min-w-4",
          index < currentStepIndex ? "bg-primary" : "bg-muted"
        )
      }
    )
  ] }, step.id)) }) });
}
function SteppedAutoForm({
  formSchema,
  values: initialValues,
  onValuesChange,
  onSubmit,
  fieldConfig,
  children,
  className,
  nextButtonText = "Next",
  backButtonText = "Back",
  submitButtonText = "Submit",
  StepperComponent = DefaultStepper,
  isSubmitting = false
}) {
  const steps = useMemo(() => extractStepsFromSchema(formSchema), [formSchema]);
  const hasMultipleSteps = steps.length > 1;
  const fieldAssignments = useMemo(
    () => getFieldStepAssignments(formSchema),
    [formSchema]
  );
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [accumulatedValues, setAccumulatedValues] = useState(
    initialValues ?? {}
  );
  const [completedSteps, setCompletedSteps] = useState(/* @__PURE__ */ new Set());
  const [schemaErrors, setSchemaErrors] = useState(null);
  const accumulatedValuesRef = useRef(accumulatedValues);
  const onValuesChangeRef = useRef(onValuesChange);
  useEffect(() => {
    accumulatedValuesRef.current = accumulatedValues;
  }, [accumulatedValues]);
  useEffect(() => {
    onValuesChangeRef.current = onValuesChange;
  }, [onValuesChange]);
  useEffect(() => {
    if (initialValues) {
      const newValues = {
        ...accumulatedValuesRef.current,
        ...initialValues
      };
      accumulatedValuesRef.current = newValues;
      setAccumulatedValues(newValues);
    }
  }, [initialValues]);
  const objectSchema = useMemo(() => getObjectSchema(formSchema), [formSchema]);
  const stepSchemas = useMemo(() => {
    if (!hasMultipleSteps || !objectSchema) return [];
    return steps.map(
      (_, index) => createStepSchema(objectSchema, index, fieldAssignments)
    );
  }, [hasMultipleSteps, objectSchema, steps, fieldAssignments]);
  const currentStep = steps[currentStepIndex];
  const currentStepSchema = stepSchemas[currentStepIndex];
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === steps.length - 1;
  const currentStepFieldConfig = useMemo(() => {
    if (!fieldConfig) return void 0;
    const stepFields = Array.from(fieldAssignments.entries()).filter(([, step]) => step === currentStepIndex).map(([field]) => field);
    const filtered = {};
    for (const field of stepFields) {
      if (field in fieldConfig) {
        filtered[field] = fieldConfig[field];
      }
    }
    return filtered;
  }, [fieldConfig, fieldAssignments, currentStepIndex]);
  const currentStepValues = useMemo(() => {
    const stepFields = Array.from(fieldAssignments.entries()).filter(([, step]) => step === currentStepIndex).map(([field]) => field);
    const values = {};
    for (const field of stepFields) {
      if (field in accumulatedValues) {
        values[field] = accumulatedValues[field];
      }
    }
    return values;
  }, [fieldAssignments, currentStepIndex, accumulatedValues]);
  const handleStepClick = useCallback(
    (stepId) => {
      const stepIndex = steps.findIndex((s) => s.id === stepId);
      if (stepIndex === -1) return;
      const canNavigate = stepIndex === currentStepIndex || completedSteps.has(stepIndex) || stepIndex === currentStepIndex + 1 && completedSteps.has(currentStepIndex);
      if (canNavigate) {
        setCurrentStepIndex(stepIndex);
        setSchemaErrors(null);
      }
    },
    [steps, currentStepIndex, completedSteps]
  );
  const handleStepValuesChange = useCallback(
    (stepValues, form) => {
      const newAccumulated = { ...accumulatedValuesRef.current, ...stepValues };
      accumulatedValuesRef.current = newAccumulated;
      setAccumulatedValues(newAccumulated);
      onValuesChangeRef.current?.(newAccumulated, form);
    },
    []
  );
  const handleStepSubmit = useCallback(
    (stepValues) => {
      const newAccumulated = { ...accumulatedValuesRef.current, ...stepValues };
      accumulatedValuesRef.current = newAccumulated;
      setAccumulatedValues(newAccumulated);
      onValuesChangeRef.current?.(newAccumulated, void 0);
      setCompletedSteps((prev) => /* @__PURE__ */ new Set([...prev, currentStepIndex]));
      if (isLast) {
        const allStepsCompleted = steps.every(
          (_, index) => index === currentStepIndex || completedSteps.has(index)
        );
        if (!allStepsCompleted) {
          const firstIncompleteStep = steps.findIndex(
            (_, index) => index !== currentStepIndex && !completedSteps.has(index)
          );
          if (firstIncompleteStep !== -1) {
            setCurrentStepIndex(firstIncompleteStep);
            return;
          }
        }
        const parseResult = formSchema.safeParse(newAccumulated);
        if (parseResult.success) {
          setSchemaErrors(null);
          onSubmit?.(parseResult.data);
        } else {
          setSchemaErrors(parseResult.error);
          const firstErrorPath = parseResult.error.issues[0]?.path[0];
          if (typeof firstErrorPath === "string") {
            const errorFieldStep = fieldAssignments.get(firstErrorPath);
            if (errorFieldStep !== void 0 && errorFieldStep !== currentStepIndex) {
              setCurrentStepIndex(errorFieldStep);
            }
          }
        }
      } else {
        setCurrentStepIndex((prev) => prev + 1);
      }
    },
    [isLast, onSubmit, currentStepIndex, steps, completedSteps, formSchema, fieldAssignments]
  );
  const handleBack = useCallback(() => {
    if (!isFirst) {
      setCurrentStepIndex((prev) => prev - 1);
      setSchemaErrors(null);
    }
  }, [isFirst]);
  if (!hasMultipleSteps) {
    return /* @__PURE__ */ jsxs(
      AutoForm,
      {
        formSchema,
        values: initialValues,
        onValuesChange,
        onSubmit,
        fieldConfig,
        className,
        children: [
          /* @__PURE__ */ jsx(Button, { type: "submit", disabled: isSubmitting, className: "w-full mt-4", children: submitButtonText }),
          children
        ]
      }
    );
  }
  if (!currentStepSchema || !currentStep) {
    return null;
  }
  return /* @__PURE__ */ jsxs("div", { className: cn$1("w-full", className), children: [
    /* @__PURE__ */ jsx(
      StepperComponent,
      {
        steps: steps.map((s) => ({ id: s.id, label: s.title })),
        currentStepIndex,
        currentStepId: currentStep.id,
        onStepClick: handleStepClick,
        isFirst,
        isLast
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: currentStep.title }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "Step ",
        currentStepIndex + 1,
        " of ",
        steps.length
      ] })
    ] }),
    schemaErrors && schemaErrors.issues.length > 0 && /* @__PURE__ */ jsx(
      "div",
      {
        role: "alert",
        "aria-live": "assertive",
        className: "rounded-md border border-destructive/50 bg-destructive/10 p-4 mb-4",
        children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsx(
            "svg",
            {
              className: "h-5 w-5 text-destructive shrink-0 mt-0.5",
              fill: "none",
              viewBox: "0 0 24 24",
              stroke: "currentColor",
              strokeWidth: 2,
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                }
              )
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("h4", { className: "text-sm font-medium text-destructive", children: "Validation Failed" }),
            /* @__PURE__ */ jsx("ul", { className: "mt-2 text-sm text-destructive/90 list-disc list-inside space-y-1", children: schemaErrors.issues.map((issue, index) => /* @__PURE__ */ jsxs("li", { children: [
              issue.path.length > 0 && /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
                issue.path.join("."),
                ": "
              ] }),
              issue.message
            ] }, index)) })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setSchemaErrors(null),
              className: "text-destructive/70 hover:text-destructive shrink-0",
              "aria-label": "Dismiss errors",
              children: /* @__PURE__ */ jsx("svg", { className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 18L18 6M6 6l12 12" }) })
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ jsxs(
      AutoForm,
      {
        formSchema: currentStepSchema,
        values: currentStepValues,
        onValuesChange: handleStepValuesChange,
        onSubmit: handleStepSubmit,
        fieldConfig: currentStepFieldConfig,
        className: "space-y-4",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between pt-4", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: handleBack,
                disabled: isFirst || isSubmitting,
                children: backButtonText
              }
            ),
            /* @__PURE__ */ jsx(Button, { type: "submit", disabled: isSubmitting, children: isLast ? submitButtonText : nextButtonText })
          ] }),
          children
        ]
      },
      currentStep.id
    )
  ] });
}
export {
  SteppedAutoForm as S
};
