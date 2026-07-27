(function () {
  const STORAGE_KEY = "paper1_annotation_tool_state_v1";
  const OPTIONS_KEY = "paper1_annotation_tool_options_v1";
  const ANNOTATOR_KEY = "paper1_annotation_tool_annotator_id_v1";

  const defaultOptions = {
    aspectLabels: [
      "assessment", "exam", "assignment", "project", "quiz", "feedback",
      "marking", "workload", "lecture", "tutorial", "lab", "group_work",
      "prerequisite", "course_organization", "teaching_quality",
      "resource_quality", "support", "administration", "career_relevance", "other"
    ],
    riskLabels: [
      "exam_sample_mismatch", "high_workload", "unclear_marking",
      "delayed_feedback", "harsh_grading", "poor_organization",
      "weak_teaching", "insufficient_support", "group_work_risk",
      "prerequisite_gap", "assessment_bunching", "double_pass_or_hurdle",
      "content_too_hard", "content_too_shallow", "low_practical_value",
      "positive_evidence", "none", "other"
    ]
  };

  const defaultOptionZh = {
    assessment: "考核整体",
    exam: "考试",
    assignment: "作业",
    project: "项目",
    quiz: "小测",
    feedback: "反馈",
    marking: "评分",
    workload: "工作量",
    lecture: "讲座",
    tutorial: "辅导课",
    lab: "实验课",
    group_work: "小组作业",
    prerequisite: "先修要求",
    course_organization: "课程组织",
    teaching_quality: "教学质量",
    resource_quality: "资料质量",
    support: "支持程度",
    administration: "行政安排",
    career_relevance: "职业相关性",
    exam_sample_mismatch: "考试与样题/练习不匹配",
    high_workload: "工作量过高",
    unclear_marking: "评分标准不清",
    delayed_feedback: "反馈延迟",
    harsh_grading: "给分严格/压分",
    poor_organization: "课程组织混乱",
    weak_teaching: "教学质量弱",
    insufficient_support: "支持不足",
    group_work_risk: "小组作业风险",
    prerequisite_gap: "先修知识缺口",
    assessment_bunching: "考核集中",
    double_pass_or_hurdle: "双过线/门槛要求",
    content_too_hard: "内容过难",
    content_too_shallow: "内容过浅",
    low_practical_value: "实践价值低",
    positive_evidence: "正面证据",
    none: "无",
    other: "其他"
  };

  const state = {
    comments: [],
    courses: [],
    selectedCourse: "",
    selectedIndex: 0,
    annotatorId: "",
    annotations: {},
    evidenceUnits: [],
    goldRisks: []
  };

  let options = loadOptions();

  const $ = (id) => document.getElementById(id);

  function loadOptions() {
    try {
      const saved = JSON.parse(localStorage.getItem(OPTIONS_KEY));
      return {
        aspectLabels: saved?.aspectLabels || structuredClone(defaultOptions.aspectLabels),
        riskLabels: saved?.riskLabels || structuredClone(defaultOptions.riskLabels),
        zh: { ...defaultOptionZh, ...(saved?.zh || {}) }
      };
    } catch {
      return {
        ...structuredClone(defaultOptions),
        zh: { ...defaultOptionZh }
      };
    }
  }

  function saveOptions() {
    localStorage.setItem(OPTIONS_KEY, JSON.stringify(options));
  }

  function optionDisplay(value) {
    const zh = options.zh?.[value] || "";
    return zh ? `${value} / ${zh}` : `${value} / 未填写中文`;
  }

  function saveState() {
    const payload = {
      annotations: state.annotations,
      evidenceUnits: state.evidenceUnits,
      goldRisks: state.goldRisks
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    localStorage.setItem(ANNOTATOR_KEY, state.annotatorId || "");
  }

  function loadState() {
    try {
      const payload = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!payload) return;
      state.annotations = payload.annotations || {};
      state.evidenceUnits = payload.evidenceUnits || [];
      state.goldRisks = payload.goldRisks || [];
    } catch {
      // Ignore corrupted local state.
    }
    state.annotatorId = localStorage.getItem(ANNOTATOR_KEY) || "";
  }

  function syncAnnotatorFromInput() {
    const input = $("annotatorId");
    if (!input) return;
    state.annotatorId = input.value.trim();
    localStorage.setItem(ANNOTATOR_KEY, state.annotatorId);
  }

  function requireAnnotatorId() {
    syncAnnotatorFromInput();
    if (state.annotatorId) return true;
    alert("请先填写 annotator_id / 标注人 ID，再导出或保存。");
    $("annotatorId").focus();
    return false;
  }

  function filenameWithAnnotator(baseName) {
    const safe = (state.annotatorId || "unknown").replace(/[^a-zA-Z0-9_-]+/g, "_");
    return baseName.replace(".csv", `_${safe}.csv`);
  }

  function parseCsv(text) {
    if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
    const rows = [];
    let row = [];
    let field = "";
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      const next = text[i + 1];
      if (inQuotes) {
        if (ch === '"' && next === '"') {
          field += '"';
          i++;
        } else if (ch === '"') {
          inQuotes = false;
        } else {
          field += ch;
        }
      } else {
        if (ch === '"') {
          inQuotes = true;
        } else if (ch === ",") {
          row.push(field);
          field = "";
        } else if (ch === "\n") {
          row.push(field);
          rows.push(row);
          row = [];
          field = "";
        } else if (ch !== "\r") {
          field += ch;
        }
      }
    }
    if (field.length || row.length) {
      row.push(field);
      rows.push(row);
    }
    if (!rows.length) return [];
    const header = rows.shift().map((h) => h.trim());
    return rows
      .filter((r) => r.some((v) => v && v.trim()))
      .map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] || ""])));
  }

  function toCsv(rows, header) {
    const esc = (value) => {
      const s = value == null ? "" : String(value);
      return /[",\n\r]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
    };
    return "\ufeff" + [header, ...rows].map((row) => row.map(esc).join(",")).join("\r\n");
  }

  function downloadCsv(filename, rows, header) {
    const blob = new Blob([toCsv(rows, header)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function groupCourses() {
    const map = new Map();
    for (const c of state.comments) {
      const code = c.course_code || "UNKNOWN";
      if (!map.has(code)) {
        map.set(code, {
          course_code: code,
          course_title_en: c.course_title_en || "",
          course_title_zh: c.course_title_zh || "",
          comments: []
        });
      }
      map.get(code).comments.push(c);
    }
    state.courses = Array.from(map.values()).sort((a, b) => {
      if (b.comments.length !== a.comments.length) return b.comments.length - a.comments.length;
      return a.course_code.localeCompare(b.course_code);
    });
  }

  function currentCourse() {
    return state.courses.find((c) => c.course_code === state.selectedCourse) || null;
  }

  function currentComment() {
    const course = currentCourse();
    if (!course) return null;
    return course.comments[state.selectedIndex] || null;
  }

  function annotationKey(comment) {
    return comment ? String(comment.comment_id || `${comment.course_code}-${state.selectedIndex}`) : "";
  }

  function blankAnnotation(comment) {
    return {
      course_code: comment.course_code || "",
      course_title_en: comment.course_title_en || "",
      comment_id: comment.comment_id || "",
      annotator_id: state.annotatorId || "",
      first_hand_experience: "",
      sentiment: "",
      specificity_0_3: "",
      low_evidence_general: "",
      risk_severity_0_3: "",
      contains_concrete_evidence: "",
      aspect_labels: [],
      risk_labels: [],
      evidence_span: "",
      notes: "",
      updated_at: ""
    };
  }

  function getAnnotation(comment) {
    if (!comment) return null;
    const key = annotationKey(comment);
    if (!state.annotations[key]) state.annotations[key] = blankAnnotation(comment);
    return state.annotations[key];
  }

  function setSelect(id, value) {
    $(id).value = value || "";
  }

  function getSelect(id) {
    return $(id).value || "";
  }

  function renderStatus() {
    if ($("annotatorId") && $("annotatorId").value !== state.annotatorId) {
      $("annotatorId").value = state.annotatorId || "";
    }
    const annotatedCount = Object.values(state.annotations).filter((a) => a.updated_at).length;
    $("datasetStatus").textContent = state.comments.length
      ? `已导入 ${state.comments.length} 条评论，${state.courses.length} 门课程；已保存 ${annotatedCount} 条评论标注。`
      : "尚未导入 CSV。";
  }

  function renderCourseList() {
    const q = $("courseSearch").value.trim().toLowerCase();
    const container = $("courseList");
    container.innerHTML = "";
    for (const course of state.courses) {
      const text = `${course.course_code} ${course.course_title_en} ${course.course_title_zh}`.toLowerCase();
      if (q && !text.includes(q)) continue;
      const annotated = course.comments.filter((c) => state.annotations[annotationKey(c)]?.updated_at).length;
      const btn = document.createElement("button");
      btn.className = "course-item" + (course.course_code === state.selectedCourse ? " active" : "");
      btn.innerHTML = `
        <span class="course-code">${course.course_code}</span>
        <span class="course-count">${annotated}/${course.comments.length}</span>
        <span class="course-title">${course.course_title_en || course.course_title_zh || ""}</span>
      `;
      btn.addEventListener("click", () => {
        persistCurrentForm();
        state.selectedCourse = course.course_code;
        state.selectedIndex = 0;
        renderAll();
      });
      container.appendChild(btn);
    }
  }

  function renderCurrentCourse() {
    const course = currentCourse();
    if (!course) {
      $("courseTitle").textContent = "请选择课程";
      $("courseMeta").textContent = "导入 CSV 后，从左侧选择一门课开始标注。";
      return;
    }
    $("courseTitle").textContent = `${course.course_code} ${course.course_title_en || course.course_title_zh || ""}`;
    $("courseMeta").textContent = `${course.comments.length} 条评论；当前第 ${state.selectedIndex + 1} 条。`;
  }

  function renderComment() {
    const course = currentCourse();
    const comment = currentComment();
    if (!course || !comment) {
      $("commentCounter").textContent = "0 / 0";
      $("commentId").textContent = "comment_id: -";
      $("studyYear").textContent = "study_year: -";
      $("commentContent").textContent = "暂无评论。";
      loadAnnotationToForm(null);
      renderEvidenceList();
      renderGoldRiskList();
      return;
    }
    $("commentCounter").textContent = `${state.selectedIndex + 1} / ${course.comments.length}`;
    $("commentId").textContent = `comment_id: ${comment.comment_id || "-"}`;
    $("studyYear").textContent = `study_year: ${comment.study_year || "-"}`;
    $("commentContent").textContent = comment.content || "";
    loadAnnotationToForm(comment);
    renderEvidenceList();
    renderGoldRiskList();
  }

  function renderMultiSelect(targetId, title, optionKey, selectedValues) {
    const wrap = $(targetId);
    const selected = new Set(selectedValues || []);
    wrap.innerHTML = "";
    const box = document.createElement("div");
    box.className = "multi-box";
    const chips = options[optionKey].map((label) => `
      <label class="chip">
        <input type="checkbox" value="${escapeHtml(label)}" ${selected.has(label) ? "checked" : ""}>
        ${escapeHtml(optionDisplay(label))}
      </label>
    `).join("");
    box.innerHTML = `<h3>${title}</h3><div class="chips">${chips}</div>`;
    wrap.appendChild(box);
  }

  function getMultiValues(targetId) {
    return Array.from($(targetId).querySelectorAll("input[type=checkbox]:checked")).map((el) => el.value);
  }

  function loadAnnotationToForm(comment) {
    renderMultiSelect("aspectLabels", "Aspect labels / 课程方面", "aspectLabels", []);
    renderMultiSelect("riskLabels", "Risk labels / 风险类型", "riskLabels", []);
    if (!comment) {
      ["firstHand", "sentiment", "specificity", "lowEvidence", "riskSeverity", "hasEvidence"].forEach((id) => setSelect(id, ""));
      $("evidenceSpan").value = "";
      $("notes").value = "";
      return;
    }
    const ann = getAnnotation(comment);
    setSelect("firstHand", ann.first_hand_experience);
    setSelect("sentiment", ann.sentiment);
    setSelect("specificity", ann.specificity_0_3);
    setSelect("lowEvidence", ann.low_evidence_general);
    setSelect("riskSeverity", ann.risk_severity_0_3);
    setSelect("hasEvidence", ann.contains_concrete_evidence);
    $("evidenceSpan").value = ann.evidence_span || "";
    $("notes").value = ann.notes || "";
    renderMultiSelect("aspectLabels", "Aspect labels / 课程方面", "aspectLabels", ann.aspect_labels || []);
    renderMultiSelect("riskLabels", "Risk labels / 风险类型", "riskLabels", ann.risk_labels || []);
  }

  function persistCurrentForm() {
    const comment = currentComment();
    if (!comment) return;
    const key = annotationKey(comment);
    const ann = getAnnotation(comment);
    Object.assign(ann, {
      course_code: comment.course_code || "",
      course_title_en: comment.course_title_en || "",
      comment_id: comment.comment_id || "",
      annotator_id: state.annotatorId || "",
      first_hand_experience: getSelect("firstHand"),
      sentiment: getSelect("sentiment"),
      specificity_0_3: getSelect("specificity"),
      low_evidence_general: getSelect("lowEvidence"),
      risk_severity_0_3: getSelect("riskSeverity"),
      contains_concrete_evidence: getSelect("hasEvidence"),
      aspect_labels: getMultiValues("aspectLabels"),
      risk_labels: getMultiValues("riskLabels"),
      evidence_span: $("evidenceSpan").value.trim(),
      notes: $("notes").value.trim(),
      updated_at: new Date().toISOString()
    });
    state.annotations[key] = ann;
    saveState();
    renderStatus();
    renderCourseList();
  }

  function clearCurrentAnnotation() {
    const comment = currentComment();
    if (!comment) return;
    delete state.annotations[annotationKey(comment)];
    saveState();
    loadAnnotationToForm(comment);
    renderStatus();
    renderCourseList();
  }

  function addEvidenceUnit() {
    const comment = currentComment();
    if (!comment) return;
    const course = currentCourse();
    const index = state.evidenceUnits.filter((e) => e.course_code === course.course_code).length + 1;
    const evidence = {
      course_code: course.course_code,
      comment_id: comment.comment_id || "",
      evidence_id: `${course.course_code}-E${String(index).padStart(3, "0")}`,
      annotator_id: state.annotatorId || "",
      evidence_text: $("evidenceText").value.trim(),
      aspect_label: $("evidenceAspect").value.trim(),
      risk_label: $("evidenceRisk").value.trim(),
      risk_severity: $("evidenceSeverity").value,
      is_decision_relevant: $("evidenceDecisionRelevant").value
    };
    if (!evidence.evidence_text) return alert("请先填写证据文本。");
    state.evidenceUnits.push(evidence);
    ["evidenceText", "evidenceAspect", "evidenceRisk"].forEach((id) => ($(id).value = ""));
    $("evidenceSeverity").value = "";
    $("evidenceDecisionRelevant").value = "";
    saveState();
    renderEvidenceList();
  }

  function renderEvidenceList() {
    const comment = currentComment();
    const list = $("evidenceList");
    list.innerHTML = "";
    if (!comment) return;
    const items = state.evidenceUnits.filter((e) => e.comment_id === (comment.comment_id || ""));
    if (!items.length) {
      list.innerHTML = `<p class="hint">当前评论还没有 evidence unit。</p>`;
      return;
    }
    for (const item of items) {
      const row = document.createElement("div");
      row.className = "row-item";
      row.innerHTML = `
        <div>
          <b>${escapeHtml(item.evidence_id)}</b>
          <small>${escapeHtml(item.aspect_label)} / ${escapeHtml(item.risk_label)} / ${escapeHtml(item.risk_severity)}</small>
          <div>${escapeHtml(item.evidence_text)}</div>
        </div>
        <button class="delete-btn">删除</button>
      `;
      row.querySelector("button").addEventListener("click", () => {
        state.evidenceUnits = state.evidenceUnits.filter((e) => e !== item);
        saveState();
        renderEvidenceList();
      });
      list.appendChild(row);
    }
  }

  function addGoldRisk() {
    const course = currentCourse();
    if (!course) return;
    const index = state.goldRisks.filter((r) => r.course_code === course.course_code).length + 1;
    const risk = {
      course_code: course.course_code,
      course_title_en: course.course_title_en || "",
      gold_risk_id: `${course.course_code}-R${String(index).padStart(3, "0")}`,
      annotator_id: state.annotatorId || "",
      risk_label: $("goldRiskLabel").value.trim(),
      risk_description: $("goldRiskDescription").value.trim(),
      risk_severity: $("goldRiskSeverity").value,
      supporting_comment_ids: $("supportingCommentIds").value.trim(),
      supporting_evidence_ids: $("supportingEvidenceIds").value.trim(),
      support_count: countCsvLike($("supportingCommentIds").value),
      is_low_frequency_risk: $("isLowFrequencyRisk").value,
      is_critical_risk: $("isCriticalRisk").value
    };
    if (!risk.risk_label || !risk.risk_description) return alert("请至少填写 risk_label 和 risk_description。");
    state.goldRisks.push(risk);
    ["goldRiskLabel", "goldRiskDescription", "supportingCommentIds", "supportingEvidenceIds"].forEach((id) => ($(id).value = ""));
    ["goldRiskSeverity", "isLowFrequencyRisk", "isCriticalRisk"].forEach((id) => ($(id).value = ""));
    saveState();
    renderGoldRiskList();
  }

  function renderGoldRiskList() {
    const course = currentCourse();
    const list = $("goldRiskList");
    list.innerHTML = "";
    if (!course) return;
    const items = state.goldRisks.filter((r) => r.course_code === course.course_code);
    if (!items.length) {
      list.innerHTML = `<p class="hint">当前课程还没有 must-report risk。</p>`;
      return;
    }
    for (const item of items) {
      const row = document.createElement("div");
      row.className = "row-item";
      row.innerHTML = `
        <div>
          <b>${escapeHtml(item.gold_risk_id)} ${escapeHtml(item.risk_label)}</b>
          <small>${escapeHtml(item.risk_severity)} / comments: ${escapeHtml(item.supporting_comment_ids)}</small>
          <div>${escapeHtml(item.risk_description)}</div>
        </div>
        <button class="delete-btn">删除</button>
      `;
      row.querySelector("button").addEventListener("click", () => {
        state.goldRisks = state.goldRisks.filter((r) => r !== item);
        saveState();
        renderGoldRiskList();
      });
      list.appendChild(row);
    }
  }

  function renderOptionEditor() {
    const container = $("optionEditor");
    container.innerHTML = "";
    [
      ["aspectLabels", "Aspect labels / 课程方面标签"],
      ["riskLabels", "Risk labels / 风险类型标签"]
    ].forEach(([key, title]) => {
      const group = document.createElement("div");
      group.className = "option-group";
      group.innerHTML = `<h3>${title}</h3>`;
      options[key].forEach((value, index) => {
        const line = document.createElement("div");
        line.className = "option-line";
        line.innerHTML = `
          <input class="option-en" value="${escapeHtml(value)}" title="英文导出值">
          <input class="option-zh" value="${escapeHtml(options.zh?.[value] || "")}" title="中文显示名" placeholder="中文显示名">
          <button>删除</button>
        `;
        line.querySelector(".option-en").addEventListener("change", (e) => {
          const oldValue = options[key][index];
          const newValue = e.target.value.trim();
          const oldZh = options.zh?.[oldValue] || "";
          options[key][index] = newValue;
          if (newValue && oldValue !== newValue) {
            delete options.zh[oldValue];
            options.zh[newValue] = oldZh;
          }
          options[key] = unique(options[key].filter(Boolean));
          saveOptions();
          renderAll();
        });
        line.querySelector(".option-zh").addEventListener("change", (e) => {
          const currentValue = options[key][index];
          options.zh[currentValue] = e.target.value.trim();
          saveOptions();
          renderAll();
        });
        line.querySelector("button").addEventListener("click", () => {
          delete options.zh[options[key][index]];
          options[key].splice(index, 1);
          saveOptions();
          renderAll();
        });
        group.appendChild(line);
      });
      const addLine = document.createElement("div");
      addLine.className = "option-line";
      addLine.innerHTML = `<input class="option-en" placeholder="新增英文值"><input class="option-zh" placeholder="中文显示名"><button>添加</button>`;
      addLine.querySelector("button").addEventListener("click", () => {
        const v = addLine.querySelector(".option-en").value.trim();
        const zh = addLine.querySelector(".option-zh").value.trim();
        if (!v) return;
        options[key] = unique([...options[key], v]);
        options.zh[v] = zh;
        saveOptions();
        renderAll();
      });
      group.appendChild(addLine);
      container.appendChild(group);
    });
  }

  function renderAll() {
    renderStatus();
    renderCourseList();
    renderCurrentCourse();
    renderComment();
    renderOptionEditor();
  }

  function exportReviewAnnotations() {
    if (!requireAnnotatorId()) return;
    persistCurrentForm();
    const header = [
      "annotator_id", "course_code", "course_title_en", "comment_id", "first_hand_experience",
      "contains_concrete_evidence", "specificity_0_3", "low_evidence_general",
      "aspect_labels", "risk_labels", "risk_severity_0_3", "sentiment",
      "evidence_span", "notes", "updated_at"
    ];
    const rows = Object.values(state.annotations).map((a) => [
      a.annotator_id || state.annotatorId, a.course_code, a.course_title_en, a.comment_id, a.first_hand_experience,
      a.contains_concrete_evidence, a.specificity_0_3, a.low_evidence_general,
      (a.aspect_labels || []).join(";"), (a.risk_labels || []).join(";"),
      a.risk_severity_0_3, a.sentiment, a.evidence_span, a.notes, a.updated_at
    ]);
    downloadCsv(filenameWithAnnotator("review_annotations.csv"), rows, header);
  }

  function exportEvidenceUnits() {
    if (!requireAnnotatorId()) return;
    persistCurrentForm();
    const header = [
      "annotator_id", "course_code", "comment_id", "evidence_id", "evidence_text",
      "aspect_label", "risk_label", "risk_severity", "is_decision_relevant"
    ];
    const rows = state.evidenceUnits.map((e) => header.map((h) => {
      if (h === "annotator_id") return e.annotator_id || state.annotatorId;
      return e[h] || "";
    }));
    downloadCsv(filenameWithAnnotator("evidence_units.csv"), rows, header);
  }

  function exportGoldRisks() {
    if (!requireAnnotatorId()) return;
    persistCurrentForm();
    const header = [
      "annotator_id", "course_code", "course_title_en", "gold_risk_id", "risk_label",
      "risk_description", "risk_severity", "supporting_comment_ids",
      "supporting_evidence_ids", "support_count", "is_low_frequency_risk", "is_critical_risk"
    ];
    const rows = state.goldRisks.map((r) => header.map((h) => {
      if (h === "annotator_id") return r.annotator_id || state.annotatorId;
      return r[h] || "";
    }));
    downloadCsv(filenameWithAnnotator("course_gold_risks.csv"), rows, header);
  }

  function countCsvLike(text) {
    return text.split(/[;,，、\s]+/).map((x) => x.trim()).filter(Boolean).length;
  }

  function unique(values) {
    return Array.from(new Set(values));
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function bindEvents() {
    $("csvInput").addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const text = await file.text();
      state.comments = parseCsv(text);
      groupCourses();
      state.selectedCourse = state.courses[0]?.course_code || "";
      state.selectedIndex = 0;
      renderAll();
    });
    $("annotatorId").addEventListener("input", syncAnnotatorFromInput);

    $("courseSearch").addEventListener("input", renderCourseList);
    $("saveAnnotationBtn").addEventListener("click", () => {
      if (!requireAnnotatorId()) return;
      persistCurrentForm();
      alert("已保存当前评论标注。");
    });
    $("clearAnnotationBtn").addEventListener("click", clearCurrentAnnotation);
    $("copySelectionBtn").addEventListener("click", () => {
      const selected = window.getSelection().toString().trim();
      if (selected) $("evidenceSpan").value = selected;
    });
    $("prevCommentBtn").addEventListener("click", () => {
      persistCurrentForm();
      const course = currentCourse();
      if (!course) return;
      state.selectedIndex = Math.max(0, state.selectedIndex - 1);
      renderAll();
    });
    $("nextCommentBtn").addEventListener("click", () => {
      persistCurrentForm();
      const course = currentCourse();
      if (!course) return;
      state.selectedIndex = Math.min(course.comments.length - 1, state.selectedIndex + 1);
      renderAll();
    });
    $("addEvidenceBtn").addEventListener("click", addEvidenceUnit);
    $("addGoldRiskBtn").addEventListener("click", addGoldRisk);
    $("exportReviewBtn").addEventListener("click", exportReviewAnnotations);
    $("exportEvidenceBtn").addEventListener("click", exportEvidenceUnits);
    $("exportRiskBtn").addEventListener("click", exportGoldRisks);
    $("resetOptionsBtn").addEventListener("click", () => {
      if (!confirm("确定恢复默认标签？自定义标签会被覆盖。")) return;
      options = {
        ...structuredClone(defaultOptions),
        zh: { ...defaultOptionZh }
      };
      saveOptions();
      renderAll();
    });

    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        persistCurrentForm();
      }
    });
  }

  loadState();
  bindEvents();
  renderAll();
})();
