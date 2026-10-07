export type Tool = "email" | "summary" | "planner";

const FORMAT = "Respond in clean Markdown. Do not add preamble or closing remarks about being an AI.";

type In = Partial<Record<"tone"|"recipient"|"purpose"|"details"|"sender"|"title"|"notes"|"range"|"hours"|"tasks", string>>;
export function buildPrompt(tool: Tool, i: In) {
  if (tool === "email") {
    return {
      system: `You write clear, well-structured professional emails. ${FORMAT} Start with a line "**Subject:** ..." then a blank line, then the email body with greeting and sign-off.`,
      user: `Tone: ${i.tone || "Formal"}\nRecipient: ${i.recipient || "(unspecified)"}\nPurpose: ${i.purpose || ""}\nKey points:\n${i.details || ""}\nSender name: ${i.sender || "(leave a placeholder)"}`,
    };
  }
  if (tool === "summary") {
    return {
      system: `You summarize meeting notes. ${FORMAT} Use exactly these sections as ## headings: Summary (3-5 bullets), Key Discussion Points, Decisions, Action Items (as "- [ ] task — owner — due date" where known), Deadlines. Write "None identified" for empty sections. Never invent facts.`,
      user: `Meeting title: ${i.title || "(untitled)"}\n\nNotes:\n${i.notes || ""}`,
    };
  }
  return {
    system: `You are a productivity planner. ${FORMAT} Produce: ## Priorities (tasks ranked using urgency/importance, one-line reason each), ## Schedule (a Markdown table with columns Time | Task | Notes; for a weekly plan use Day | Time | Task), ## Suggested Order and Tips (short). Include breaks. Be realistic about durations.`,
    user: `Plan type: ${i.range || "Daily"}\nWorking hours: ${i.hours || "09:00-17:00"}\nTasks (with priority/deadline where given):\n${i.tasks || ""}\nExtra notes: ${i.notes || "none"}`,
  };
}
