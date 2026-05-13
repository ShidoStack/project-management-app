export const MEMBERS = [
  {id:'m1', name:'Alex Reed', initials:'AR', color:'#c4531a'},
  {id:'m2', name:'Priya Nair', initials:'PN', color:'#2d6a4f'},
  {id:'m3', name:'Jake Wu', initials:'JW', color:'#1a4a7a'},
  {id:'m4', name:'Sofia Mell', initials:'SM', color:'#5b21b6'},
  {id:'m5', name:'Omar Diaz', initials:'OD', color:'#b5500a'},
];

export const DEFAULT_COLUMNS = ['Backlog', 'To Do', 'In Progress', 'Review', 'Done'];

export const getInitialProjects = () => {
  const today = new Date();
  const fmt = d => d.toISOString().slice(0,10);
  const add = (n) => { const d = new Date(today); d.setDate(d.getDate()+n); return fmt(d); };
  const sub = (n) => { const d = new Date(today); d.setDate(d.getDate()-n); return fmt(d); };

  return [
    {
      id:'p1', name:'Website Redesign', color:'#c4531a', deadline: add(30),
      columns: ['Backlog', 'Design', 'Development', 'Review', 'Done'],
      tasks: [
        {id:'t1',title:'Redesign landing hero section',desc:'Create new hero with animation and modern typography. Reference Dribbble shots for inspiration.',priority:'critical',column:'Development',deadline:add(3),assignees:['m1','m3'],tag:'design',comments:[{id:'c1',author:'m2',text:'Love the direction! Let\'s go with the dark variant.',time:'2h ago'},{id:'c2',author:'m1',text:'Updated the mockups in Figma — link in description.',time:'1h ago'}],attachments:[{name:'hero-mockup.fig',size:'2.4 MB'},{name:'brief.pdf',size:'340 KB'}],checklist:[{id:'cl1',text:'Desktop mockup',done:true},{id:'cl2',text:'Mobile mockup',done:true},{id:'cl3',text:'Animation prototype',done:false},{id:'cl4',text:'Dev handoff',done:false}]},
        {id:'t2',title:'Set up design system tokens',desc:'Configure typography, color, and spacing tokens in Figma and export to CSS variables.',priority:'high',column:'Design',deadline:add(7),assignees:['m4'],tag:'design',comments:[],attachments:[],checklist:[{id:'cl5',text:'Typography scale',done:true},{id:'cl6',text:'Color tokens',done:false}]},
        {id:'t3',title:'Implement responsive navigation',desc:'Build mobile-first navigation with hamburger menu and smooth transitions.',priority:'high',column:'Development',deadline:add(5),assignees:['m3'],tag:'dev',comments:[{id:'c3',author:'m3',text:'Using CSS grid for layout. Should be clean.',time:'3h ago'}],attachments:[],checklist:[]},
        {id:'t4',title:'Write homepage copy',desc:'Draft headline, subheadline, and CTA copy for all sections.',priority:'medium',column:'Backlog',deadline:add(12),assignees:['m5'],tag:'content',comments:[],attachments:[],checklist:[]},
        {id:'t5',title:'SEO audit and optimization',desc:'Run full audit, fix meta tags, improve page speed to 90+ Lighthouse score.',priority:'medium',column:'Backlog',deadline:add(20),assignees:['m2'],tag:'marketing',comments:[],attachments:[],checklist:[]},
        {id:'t6',title:'Cross-browser testing',desc:'QA on Chrome, Firefox, Safari, and Edge. Document any visual regressions.',priority:'low',column:'Backlog',deadline:add(25),assignees:['m1','m3'],tag:'dev',comments:[],attachments:[],checklist:[]},
        {id:'t7',title:'Fix navigation menu z-index bug',desc:'Menu overlaps modal dialogs on mobile.',priority:'critical',column:'Review',deadline:sub(1),assignees:['m3'],tag:'bug',comments:[],attachments:[],checklist:[]},
        {id:'t8',title:'Create 404 page',desc:'Design and build custom 404 with brand personality.',priority:'low',column:'Done',deadline:sub(5),assignees:['m4'],tag:'design',comments:[],attachments:[],checklist:[]},
      ]
    },
    {
      id:'p2', name:'Mobile App v2', color:'#2d6a4f', deadline: add(60),
      columns: ['Backlog', 'To Do', 'In Progress', 'Review', 'Done'],
      tasks: [
        {id:'t9',title:'Onboarding flow redesign',desc:'Simplify 5-step onboarding to 3 steps. Reduce drop-off by 40%.',priority:'critical',column:'In Progress',deadline:add(10),assignees:['m1','m4'],tag:'feature',comments:[],attachments:[],checklist:[{id:'cl7',text:'UX research review',done:true},{id:'cl8',text:'Wire-frames',done:true},{id:'cl9',text:'Prototype',done:false}]},
        {id:'t10',title:'Push notification service',desc:'Integrate Firebase push notifications with user preference controls.',priority:'high',column:'To Do',deadline:add(15),assignees:['m3'],tag:'dev',comments:[],attachments:[],checklist:[]},
        {id:'t11',title:'App Store screenshots',desc:'Design 5 new App Store screenshots showing key features.',priority:'medium',column:'Backlog',deadline:add(45),assignees:['m4'],tag:'design',comments:[],attachments:[],checklist:[]},
        {id:'t12',title:'Performance profiling',desc:'Run Xcode Instruments, identify and fix memory leaks.',priority:'high',column:'Review',deadline:add(8),assignees:['m3','m2'],tag:'dev',comments:[],attachments:[],checklist:[]},
      ]
    },
    {
      id:'p3', name:'Q3 Marketing Campaign', color:'#5b21b6', deadline: add(45),
      columns: ['Ideas', 'Planning', 'Production', 'Live', 'Archive'],
      tasks: [
        {id:'t13',title:'Campaign strategy deck',desc:'Present Q3 campaign strategy to stakeholders by end of month.',priority:'critical',column:'Planning',deadline:add(4),assignees:['m2','m5'],tag:'marketing',comments:[],attachments:[],checklist:[]},
        {id:'t14',title:'Social media content calendar',desc:'Plan 60 posts across Instagram, LinkedIn, and Twitter for Q3.',priority:'high',column:'Ideas',deadline:add(14),assignees:['m5'],tag:'content',comments:[],attachments:[],checklist:[]},
        {id:'t15',title:'Video ad production',desc:'Script, shoot, and edit 30-second brand video.',priority:'high',column:'Production',deadline:add(21),assignees:['m1','m2'],tag:'marketing',comments:[],attachments:[],checklist:[]},
      ]
    }
  ];
};
