const modules = [
  {
    id: "org",
    title: "组织诊断",
    priority: "P0",
    summary: "BP 的第一性原理：判断业务目标背后的组织瓶颈，而不是只接招聘需求。",
    points: ["组织设计：结构、汇报关系、管理跨度、前中后台分工", "诊断框架：7S、组织健康、Galbraith Star Model", "关键问题：缺能力、缺机制、缺激励、缺管理，还是战略不清"],
    tasks: ["画出一个业务团队的组织结构图", "用 7S 模型复盘一次组织问题", "写一页“该不该加人”的判断标准"]
  },
  {
    id: "business",
    title: "业务理解",
    priority: "P0",
    summary: "从岗位视角升级到经营视角，理解收入、成本、人效、预算与增长逻辑。",
    points: ["经营基础：收入、利润、毛利率、ROI、人效、HC planning", "分析框架：PEST、SWOT、五力、Unit Economics", "AI 团队判断：研究、平台、产品化、商业化、基础设施"],
    tasks: ["整理所在业务的核心指标树", "写出一个岗位需求背后的业务假设", "分析一个 AI 团队当前最稀缺的组织能力"]
  },
  {
    id: "talent",
    title: "人才管理",
    priority: "P1",
    summary: "从 Talent Acquisition 延伸到 Talent Management，关注进来后能否成长、保留和产出。",
    points: ["人才盘点：九宫格、高潜、关键岗位继任、bench strength", "绩效管理：OKR/KPI、校准、反馈、低绩效管理", "发展体系：IDP、能力模型、职级、领导力、双通道"],
    tasks: ["做一份九宫格概念笔记", "设计关键岗位继任表字段", "梳理 AI 岗位能力模型草稿"]
  },
  {
    id: "behavior",
    title: "组织行为学",
    priority: "P1",
    summary: "理解个体、团队、权力和非正式网络，让 BP 能处理真实组织场景。",
    points: ["个体：动机、心理契约、职业锚、认知偏差、压力倦怠", "团队：Tuckman、心理安全感、冲突管理、跨团队协作", "组织政治：权力来源、利益相关方、影响力、变革阻力"],
    tasks: ["复盘一个中层抗拒变化的真实场景", "记录一次跨团队冲突中的利益相关方", "整理三类常见认知偏差对人才判断的影响"]
  },
  {
    id: "compliance",
    title: "劳动关系合规",
    priority: "P2",
    summary: "BP 的底线能力：识别敏感动作的风险，知道何时拉 ER 或法务。",
    points: ["合同、试用期、调岗调薪、PIP、解除劳动关系", "竞业限制、加班工时、员工申诉、反骚扰、利益冲突", "敏感场景：低绩效、组织调整、投诉调查、裁撤沟通"],
    tasks: ["建立高风险场景检查清单", "整理 PIP 基本流程与风险点", "写一份组织调整沟通前的准备清单"]
  },
  {
    id: "change",
    title: "变革管理",
    priority: "P2",
    summary: "高级 BP 能力：帮助组织完成战略、结构、机制与行为变化。",
    points: ["框架：Kotter 八步、ADKAR", "动作：共识建立、沟通节奏、阻力识别、关键人影响", "结果：把变化落到组织机制、管理行为和人才配置"],
    tasks: ["用 ADKAR 拆解一次组织变化", "设计一个 30 天变革沟通节奏", "列出变革中需要争取的关键影响者"]
  }
];

const canvasDefaults = {
  canvasBusiness: "目标是什么？增长、效率、商业化、产品化、技术突破，还是组织收缩？\n\n可记录：北极星指标、收入/成本/人效、关键里程碑。",
  canvasBottleneck: "真正卡住的是什么？能力、结构、流程、激励、管理、协作，还是战略翻译不清？\n\n可记录：证据、反例、利益相关方、当前约束。",
  canvasTalent: "需要什么人才动作？招聘、盘点、继任、绩效、发展、激励、组织调整，还是变革沟通？\n\n可记录：优先级、负责人、30 天动作。"
};

const storageKeys = {
  checks: "bp-learning-checks",
  notes: "bp-learning-notes",
  activeNote: "bp-active-note",
  canvas: "bp-first-principles-canvas"
};

const moduleGrid = document.querySelector("#moduleGrid");
const checklist = document.querySelector("#checklist");
const noteModule = document.querySelector("#noteModule");
const notesArea = document.querySelector("#notesArea");
const saveState = document.querySelector("#saveState");
const progressValue = document.querySelector("#progressValue");
const progressBar = document.querySelector("#progressBar");
const canvasFields = Object.keys(canvasDefaults).map((id) => document.querySelector(`#${id}`));

let checks = JSON.parse(localStorage.getItem(storageKeys.checks) || "{}");
let notes = JSON.parse(localStorage.getItem(storageKeys.notes) || "{}");
let canvas = JSON.parse(localStorage.getItem(storageKeys.canvas) || "null") || { ...canvasDefaults };

function renderModules() {
  moduleGrid.innerHTML = modules
    .map(
      (item, index) => `
        <article class="module-card" data-index="${String(index + 1).padStart(2, "0")}">
          <header>
            <div>
              <h3>${item.title}</h3>
              <p>${item.summary}</p>
            </div>
            <span class="tag">${item.priority}</span>
          </header>
          <ul>
            ${item.points.map((point) => `<li>${point}</li>`).join("")}
          </ul>
        </article>
      `
    )
    .join("");
}

function renderChecklist() {
  checklist.innerHTML = modules
    .map(
      (item) => `
        <div class="check-group">
          <h4>${item.title}</h4>
          <ul>
            ${item.tasks
              .map((task, index) => {
                const id = `${item.id}-${index}`;
                const checked = checks[id] ? "checked" : "";
                return `
                  <li>
                    <label>
                      <input type="checkbox" data-check-id="${id}" ${checked} />
                      <span>${task}</span>
                    </label>
                  </li>
                `;
              })
              .join("")}
          </ul>
        </div>
      `
    )
    .join("");
  updateProgress();
}

function renderNoteOptions() {
  const options = [
    { id: "general", title: "总笔记" },
    { id: "principles", title: "第一性原理" },
    ...modules.map((item) => ({ id: item.id, title: item.title }))
  ];
  noteModule.innerHTML = options.map((item) => `<option value="${item.id}">${item.title}</option>`).join("");
  noteModule.value = localStorage.getItem(storageKeys.activeNote) || "general";
  notesArea.value = notes[noteModule.value] || "";
}

function renderCanvas() {
  canvasFields.forEach((field) => {
    field.value = canvas[field.id] || canvasDefaults[field.id];
  });
}

function updateProgress() {
  const total = modules.reduce((sum, item) => sum + item.tasks.length, 0);
  const done = Object.values(checks).filter(Boolean).length;
  const percent = total ? Math.round((done / total) * 100) : 0;
  progressValue.textContent = `${percent}%`;
  progressBar.style.width = `${percent}%`;
}

function flashSaved(message = "已保存到本地") {
  saveState.textContent = message;
  window.clearTimeout(notesArea.saveTimer);
  notesArea.saveTimer = window.setTimeout(() => {
    saveState.textContent = "已启用本地保存";
  }, 1100);
}

checklist.addEventListener("change", (event) => {
  if (!event.target.matches("[data-check-id]")) return;
  checks[event.target.dataset.checkId] = event.target.checked;
  localStorage.setItem(storageKeys.checks, JSON.stringify(checks));
  updateProgress();
});

noteModule.addEventListener("change", () => {
  localStorage.setItem(storageKeys.activeNote, noteModule.value);
  notesArea.value = notes[noteModule.value] || "";
});

notesArea.addEventListener("input", () => {
  notes[noteModule.value] = notesArea.value;
  localStorage.setItem(storageKeys.notes, JSON.stringify(notes));
  flashSaved();
});

canvasFields.forEach((field) => {
  field.addEventListener("input", () => {
    canvas[field.id] = field.value;
    localStorage.setItem(storageKeys.canvas, JSON.stringify(canvas));
    flashSaved("画布已保存到本地");
  });
});

document.querySelector("#resetChecks").addEventListener("click", () => {
  checks = {};
  localStorage.setItem(storageKeys.checks, JSON.stringify(checks));
  renderChecklist();
});

document.querySelector("#clearNotes").addEventListener("click", () => {
  notes[noteModule.value] = "";
  localStorage.setItem(storageKeys.notes, JSON.stringify(notes));
  notesArea.value = "";
  flashSaved("当前主题笔记已清空");
});

document.querySelector("#resetCanvas").addEventListener("click", () => {
  canvas = { ...canvasDefaults };
  localStorage.setItem(storageKeys.canvas, JSON.stringify(canvas));
  renderCanvas();
  flashSaved("画布模板已恢复");
});

renderModules();
renderChecklist();
renderNoteOptions();
renderCanvas();
