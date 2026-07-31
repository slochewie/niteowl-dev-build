import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { B as Button } from "./router-qu_5GP1h.mjs";
import { I as Input } from "./input-Ds7nu5GX.mjs";
import { T as Textarea } from "./textarea-ClKgIhzC.mjs";
import { L as Label } from "./label-DWXXj0lo.mjs";
import { a as useBoardMutations } from "./page-wrapper-D5yp3MTX.mjs";
function BoardForm({ board, onClose, onSuccess }) {
  const isEditing = !!board;
  const { createBoard, updateBoard, isCreating, isUpdating } = useBoardMutations();
  const [name, setName] = useState(board?.name || "");
  const [description, setDescription] = useState(board?.description || "");
  const [error, setError] = useState(null);
  const isPending = isCreating || isUpdating;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    try {
      if (isEditing && board) {
        await updateBoard(board.id, { name, description });
        onSuccess(board.id);
      } else {
        const newBoard = await createBoard({ name, description });
        if (newBoard?.id) {
          onSuccess(newBoard.id);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 overflow-x-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "name", children: "Name *" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          id: "name",
          value: name,
          onChange: (e) => setName(e.target.value),
          placeholder: "e.g., Project Alpha",
          disabled: isPending
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "description", children: "Description" }),
      /* @__PURE__ */ jsx(
        Textarea,
        {
          id: "description",
          value: description,
          onChange: (e) => setDescription(e.target.value),
          placeholder: "Describe your board...",
          disabled: isPending,
          rows: 3
        }
      )
    ] }),
    error && /* @__PURE__ */ jsx("div", { className: "p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md", children: error }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2 pt-2", children: [
      /* @__PURE__ */ jsx(Button, { type: "submit", disabled: isPending, children: isPending ? isEditing ? "Updating..." : "Creating..." : isEditing ? "Update Board" : "Create Board" }),
      /* @__PURE__ */ jsx(
        Button,
        {
          type: "button",
          variant: "outline",
          onClick: onClose,
          disabled: isPending,
          children: "Cancel"
        }
      )
    ] })
  ] });
}
export {
  BoardForm as B
};
