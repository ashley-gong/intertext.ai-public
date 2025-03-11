"use client";

interface SidebarProps {
  view: string;
  textFiles: { label: string; value: string }[];
  selectedText: string;
  onTextChange: (value: string, label: string) => void;
  sections: Section[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  title: string;
  onToggleSidebar: () => void;
}

export default function PassageSidebar(
  { view,
    textFiles, 
    selectedText, 
    onTextChange, 
    sections, 
    selectedIndex, 
    onSelectIndex, 
    title, 
    onToggleSidebar
  }: SidebarProps) {
  return (
    <aside className="flex flex-col w-1/6 mr-8 p-4">
      <h2 className="font-semibold text-xl mb-2">Select Text {title}</h2>
      {view === "dual" && 
        <button onClick={onToggleSidebar} className="items-start mb-4 p-2 text-xs hover:text-blue-500">
          Switch to {title === "(Left)" ? "Right" : "Left"} Sidebar
        </button>
      }
      <div className="mb-4">
        <ul className={ view === "full" ? "space-y-2 max-h-[80vh] overflow-y-auto" : "space-y-2 h-80 overflow-y-auto"}>
          {textFiles.map((file) => (
            <li
              key={file.value}
              onClick={() => onTextChange(file.value, file.label)}
              className={`cursor-pointer p-2 text-xs ${
                selectedText === file.value ? "bg-blue-500 text-white" : "bg-white"
              }`}
            >
              {file.label}
            </li>
          ))}
        </ul>
      </div>
      { view !== "full" &&
        (<>
          <h4 className="font-semibold mb-2">Sections/Line Starts</h4>
          <ul className="space-y-2 bg-white p-4 shadow-md h-64 overflow-y-auto">
            {sections.map((section, index) => (
              <li
                key={index}
                className={`cursor-pointer p-2 text-xs ${
                  selectedIndex === index ? "bg-blue-500 text-white" : "bg-gray-100"
                }`}
                onClick={() => onSelectIndex(index)}
              >
                {section.indexLabel}
              </li>
            ))}
          </ul>
        </>
        )
      }
      <p className='text-xs pt-4 text-gray-500'>
          Texts from 
          <a href='https://thelatinlibrary.com' 
            className='hover:text-blue-500'
            target="_blank" 
            rel="noopener noreferrer"
          > The Latin Library</a> (Carey)
        </p>
    </aside>
  )
}