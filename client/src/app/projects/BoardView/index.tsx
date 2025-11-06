// import { useGetTasksQuery, useUpdateTaskStatusMutation } from "@/state/api";
// import React from "react";
// import { DndProvider, useDrag, useDrop } from "react-dnd";
// import { HTML5Backend } from "react-dnd-html5-backend";
// import { Task as TaskType } from "@/state/api";
// import { EllipsisVertical, MessageSquareMore, Plus } from "lucide-react";
// import { format } from "date-fns";
// import Image from "next/image";

// type BoardProps = {
//   id: string;
//   setIsModalNewTaskOpen: (isOpen: boolean) => void;
// };

// const taskStatus = ["To Do", "Work In Progress", "Under Review", "Completed"];

// const BoardView = ({ id, setIsModalNewTaskOpen }: BoardProps) => {
//   const {
//     data: tasks,
//     isLoading,
//     error,
//   } = useGetTasksQuery({ projectId: Number(id) });
//   const [updateTaskStatus] = useUpdateTaskStatusMutation();

//   const moveTask = (taskId: number, toStatus: string) => {
//     updateTaskStatus({ taskId, status: toStatus });
//   };

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>An error occurred while fetching tasks</div>;

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
//         {taskStatus.map((status) => (
//           <TaskColumn
//             key={status}
//             status={status}
//             tasks={tasks || []}
//             moveTask={moveTask}
//             setIsModalNewTaskOpen={setIsModalNewTaskOpen}
//           />
//         ))}
//       </div>
//     </DndProvider>
//   );
// };

// type TaskColumnProps = {
//   status: string;
//   tasks: TaskType[];
//   moveTask: (taskId: number, toStatus: string) => void;
//   setIsModalNewTaskOpen: (isOpen: boolean) => void;
// };

// const TaskColumn = ({
//   status,
//   tasks,
//   moveTask,
//   setIsModalNewTaskOpen,
// }: TaskColumnProps) => {
//   const [{ isOver }, drop] = useDrop(() => ({
//     accept: "task",
//     drop: (item: { id: number }) => moveTask(item.id, status),
//     collect: (monitor: any) => ({
//       isOver: !!monitor.isOver(),
//     }),
//   }));

//   const tasksCount = tasks.filter((task) => task.status === status).length;

//   const statusColor: any = {
//     "To Do": "#2563EB",
//     "Work In Progress": "#059669",
//     "Under Review": "#D97706",
//     Completed: "#000000",
//   };

//   return (
//     <div
//       ref={(instance) => {
//         drop(instance);
//       }}
//       className={`sl:py-4 rounded-lg py-2 xl:px-2 ${isOver ? "bg-blue-100 dark:bg-neutral-950" : ""}`}
//     >
//       <div className="mb-3 flex w-full">
//         <div
//           className={`w-2 !bg-[${statusColor[status]}] rounded-s-lg`}
//           style={{ backgroundColor: statusColor[status] }}
//         />
//         <div className="flex w-full items-center justify-between rounded-e-lg bg-white px-5 py-4 dark:bg-dark-secondary">
//           <h3 className="flex items-center text-lg font-semibold dark:text-white">
//             {status}{" "}
//             <span
//               className="ml-2 inline-block rounded-full bg-gray-200 p-1 text-center text-sm leading-none dark:bg-dark-tertiary"
//               style={{ width: "1.5rem", height: "1.5rem" }}
//             >
//               {tasksCount}
//             </span>
//           </h3>
//           <div className="flex items-center gap-1">
//             <button className="flex h-6 w-5 items-center justify-center dark:text-neutral-500">
//               <EllipsisVertical size={26} />
//             </button>
//             <button
//               className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 dark:bg-dark-tertiary dark:text-white"
//               onClick={() => setIsModalNewTaskOpen(true)}
//             >
//               <Plus size={16} />
//             </button>
//           </div>
//         </div>
//       </div>

//       {tasks
//         .filter((task) => task.status === status)
//         .map((task) => (
//           <Task key={task.id} task={task} />
//         ))}
//     </div>
//   );
// };

// type TaskProps = {
//   task: TaskType;
// };

// const Task = ({ task }: TaskProps) => {
//   const [{ isDragging }, drag] = useDrag(() => ({
//     type: "task",
//     item: { id: task.id },
//     collect: (monitor: any) => ({
//       isDragging: !!monitor.isDragging(),
//     }),
//   }));

//   const taskTagsSplit = task.tags ? task.tags.split(",") : [];

//   const formattedStartDate = task.startDate
//     ? format(new Date(task.startDate), "P")
//     : "";
//   const formattedDueDate = task.dueDate
//     ? format(new Date(task.dueDate), "P")
//     : "";

//   const numberOfComments = (task.comments && task.comments.length) || 0;

//   const PriorityTag = ({ priority }: { priority: TaskType["priority"] }) => (
//     <div
//       className={`rounded-full px-2 py-1 text-xs font-semibold ${
//         priority === "Urgent"
//           ? "bg-red-200 text-red-700"
//           : priority === "High"
//             ? "bg-yellow-200 text-yellow-700"
//             : priority === "Medium"
//               ? "bg-green-200 text-green-700"
//               : priority === "Low"
//                 ? "bg-blue-200 text-blue-700"
//                 : "bg-gray-200 text-gray-700"
//       }`}
//     >
//       {priority}
//     </div>
//   );

//   return (
//     <div
//       ref={(instance) => {
//         drag(instance);
//       }}
//       className={`mb-4 rounded-md bg-white shadow dark:bg-dark-secondary ${
//         isDragging ? "opacity-50" : "opacity-100"
//       }`}
//     >
//       {task.attachments && task.attachments.length > 0 && (
//         <Image
//           src={`https://pm-s3-images.s3.us-east-2.amazonaws.com/${task.attachments[0].fileURL}`}
//           alt={task.attachments[0].fileName}
//           width={400}
//           height={200}
//           className="h-auto w-full rounded-t-md"
//         />
//       )}
//       <div className="p-4 md:p-6">
//         <div className="flex items-start justify-between">
//           <div className="flex flex-1 flex-wrap items-center gap-2">
//             {task.priority && <PriorityTag priority={task.priority} />}
//             <div className="flex gap-2">
//               {taskTagsSplit.map((tag) => (
//                 <div
//                   key={tag}
//                   className="rounded-full bg-blue-100 px-2 py-1 text-xs"
//                 >
//                   {" "}
//                   {tag}
//                 </div>
//               ))}
//             </div>
//           </div>
//           <button className="flex h-6 w-4 flex-shrink-0 items-center justify-center dark:text-neutral-500">
//             <EllipsisVertical size={26} />
//           </button>
//         </div>

//         <div className="my-3 flex justify-between">
//           <h4 className="text-md font-bold dark:text-white">{task.title}</h4>
//           {typeof task.points === "number" && (
//             <div className="text-xs font-semibold dark:text-white">
//               {task.points} pts
//             </div>
//           )}
//         </div>

//         <div className="text-xs text-gray-500 dark:text-neutral-500">
//           {formattedStartDate && <span>{formattedStartDate} - </span>}
//           {formattedDueDate && <span>{formattedDueDate}</span>}
//         </div>
//         <p className="text-sm text-gray-600 dark:text-neutral-500">
//           {task.description}
//         </p>
//         <div className="mt-4 border-t border-gray-200 dark:border-stroke-dark" />

//         {/* Users */}
//         <div className="mt-3 flex items-center justify-between">
//           <div className="flex -space-x-[6px] overflow-hidden">
//             {task.assignee && (
//               <Image
//                 key={task.assignee.userId}
//                 src={`https://pm-s3-images.s3.us-east-2.amazonaws.com/${task.assignee.profilePictureUrl!}`}
//                 alt={task.assignee.username}
//                 width={30}
//                 height={30}
//                 className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
//               />
//             )}
//             {task.author && (
//               <Image
//                 key={task.author.userId}
//                 src={`https://pm-s3-images.s3.us-east-2.amazonaws.com/${task.author.profilePictureUrl!}`}
//                 alt={task.author.username}
//                 width={30}
//                 height={30}
//                 className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
//               />
//             )}
//           </div>
//           <div className="flex items-center text-gray-500 dark:text-neutral-500">
//             <MessageSquareMore size={20} />
//             <span className="ml-1 text-sm dark:text-neutral-400">
//               {numberOfComments}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

import React, { useState } from "react";
import { Upload, X, CheckCircle, AlertTriangle, FileText, Loader } from "lucide-react";
import { DataGrid, GridColDef, GridRowId } from "@mui/x-data-grid";
import { useAppSelector } from "@/app/redux"; // Assuming this is available globally
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils"; // Assuming these utilities are available

// --- MOCK DATA FOR AVAILABLE CHECKS (Should align with your backend) ---
const availableChecks = [
  { key: "check_italy_mexico_dupes", name: "Strict Duplicate Consolidation", type: "Consolidation" },
  { key: "remove_viaplay_baltics", name: "Remove Viaplay Baltics/Poland", type: "Removal" },
  { key: "check_latam_espn", name: "Flag Missing LATAM ESPN", type: "Audit" },
  { key: "check_f1_obligations", name: "F1 Obligation Check", type: "Audit" },
  { key: "recreate_viaplay", name: "Recreate Viaplay Data", type: "Recreation" },
];

type BoardViewProps = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

// --- DEFINING COLUMNS FOR THE SUMMARY TABLE ---
const getSummaryColumns = (isDarkMode: boolean): GridColDef[] => [
  { 
    field: 'description', 
    headerName: 'Description', 
    flex: 1.5, 
    minWidth: 350,
    sortable: false,
    // FIXED: Explicitly casting params to 'any' to resolve the TS error
    valueGetter: (params: any) => params.row.description || 'N/A'
  },
  { 
    field: 'action', 
    headerName: 'Action Type', 
    width: 120,
    sortable: false,
    headerClassName: 'text-xs',
  },
  { 
    field: 'status', 
    headerName: 'Status', 
    width: 120,
    renderCell: (params) => {
      const status = params.value;
      const isSuccess = status === 'Completed' || status === 'Passed';
      const color = isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
      return (
        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${color}`}>
          {status}
        </span>
      );
    }
  },
  { 
    field: 'metric', 
    headerName: 'Change/Flag Count', 
    width: 150, 
    // FIXED: Explicitly casting params to 'any' to resolve the TS error
    // Dynamically look for the appropriate metric (rows_marked, rows_removed, etc.)
    valueGetter: (params: any) => {
        const details = params.row;
        return details.rows_marked || details.rows_removed || details.total_issues_flagged || 0;
    }
  },
  { field: 'check_key', headerName: 'Check Key', width: 150, hideable: false }, // Removed `hide: true`
];

const BoardView = ({ id, setIsModalNewTaskOpen }: BoardViewProps) => {
  // --- NEW STATE FOR TWO FILES ---
  const [selectedBSRFile, setSelectedBSRFile] = useState<File | null>(null);
  const [selectedRoscoFile, setSelectedRoscoFile] = useState<File | null>(null);
  
  const [selectedChecks, setSelectedChecks] = useState<string[]>([]);
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'loading' | 'complete'>('idle');
  const [validationResults, setValidationResults] = useState<any[]>([]); 

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  // Define the model to hide specific columns
  const columnVisibilityModel = {
    check_key: false, // Explicitly hide the check_key column
  };

  // Combined check for run button visibility
  const isReadyToRun = selectedBSRFile && selectedRoscoFile && selectedChecks.length > 0;
  
  // NOTE: You would replace this mock fetch function with actual Axios/fetch calls to your Render API
  const handleRunChecks = async () => {
    if (!isReadyToRun || processingStatus === 'loading') return;
    
    setProcessingStatus('loading');
    setValidationResults([]); 

    console.log(`Running checks on BSR: ${selectedBSRFile?.name} and Rosco: ${selectedRoscoFile?.name}`);
    
    // ----------------------------------------------------
    // *** Placeholder for actual API call to Render ***
    // ----------------------------------------------------
    await new Promise(resolve => setTimeout(resolve, 2000)); 

    const rawSummary = [
      { check_key: "check_italy_mexico_dupes", status: "Completed", action: "Consolidation", rows_marked: 23, description: "Consolidated 23 exact duplicates." },
      { check_key: "remove_viaplay_baltics", status: "Completed", action: "Removal", rows_removed: 11, description: "Removed 11 Viaplay Baltic rows." },
      { check_key: "check_latam_espn", status: "Issue Found", action: "Audit", total_issues_flagged: 2, description: "2 markets missing ESPN coverage." },
      // Add a passing check for completeness
      { check_key: "check_f1_obligations", status: "Passed", action: "Audit", total_issues_flagged: 0, description: "F1 Obligation check passed successfully." }, 
    ];
    
    // Inject ID for DataGrid
    const resultsWithId = rawSummary.map((item, index) => ({
      ...item,
      id: index + 1,
    }));

    setValidationResults(resultsWithId);
    setProcessingStatus('complete');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, fileType: 'bsr' | 'rosco') => {
    const file = event.target.files?.[0];
    if (fileType === 'bsr') {
      setSelectedBSRFile(file || null);
    } else {
      setSelectedRoscoFile(file || null);
    }
  };

  const handleCheckToggle = (key: string) => {
    setSelectedChecks(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  return (
    <div className="grid grid-cols-1 gap-8 p-4 xl:grid-cols-3">
      {/* COLUMN 1: FILE UPLOAD AND CHECKLIST (1/3 Width) */}
      <div className="col-span-1 space-y-6 rounded-lg bg-white p-6 shadow dark:bg-dark-secondary">
        <h3 className="text-xl font-bold dark:text-white">1. File Selection</h3>
        
        {/* --- BSR FILE UPLOAD --- */}
        <p className="font-medium text-gray-700 dark:text-gray-300">BSR Data File (Mandatory)</p>
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-blue-300 p-4 cursor-pointer rounded-lg bg-blue-50 dark:bg-blue-950/50">
          <FileText className="h-8 w-8 text-blue-600" />
          <p className="mt-2 text-sm text-blue-600 dark:text-blue-300 text-center">
            {selectedBSRFile ? selectedBSRFile.name : "Click to upload Master BSR (.xlsx)"}
          </p>
          <input 
            type="file" 
            className="hidden" 
            accept=".xlsx" 
            onChange={(e) => handleFileChange(e, 'bsr')} 
          />
        </label>

        {/* --- ROSCO FILE UPLOAD --- */}
        <p className="font-medium text-gray-700 dark:text-gray-300">Rosco Reference File (Mandatory)</p>
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-green-300 p-4 cursor-pointer rounded-lg bg-green-50 dark:bg-green-950/50">
          <FileText className="h-8 w-8 text-green-600" />
          <p className="mt-2 text-sm text-green-600 dark:text-green-300 text-center">
            {selectedRoscoFile ? selectedRoscoFile.name : "Click to upload Rosco File (.xlsx)"}
          </p>
          <input 
            type="file" 
            className="hidden" 
            accept=".xlsx" 
            onChange={(e) => handleFileChange(e, 'rosco')} 
          />
        </label>
        
        {/* CHECKLIST */}
        <h3 className="text-xl font-bold dark:text-white pt-4 border-t border-gray-100 dark:border-gray-700">2. Select Checks</h3>
        <div className="max-h-64 space-y-2 overflow-y-auto pr-2">
          {availableChecks.map((check) => (
            <div key={check.key} className="flex items-center justify-between rounded-md p-3 hover:bg-gray-100 dark:hover:bg-gray-700">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedChecks.includes(check.key)}
                  onChange={() => handleCheckToggle(check.key)}
                  className="form-checkbox h-4 w-4 text-blue-600 rounded"
                />
                <span className="ml-3 text-sm dark:text-gray-200">{check.name}</span>
              </label>
              <span className="text-xs text-blue-500 bg-blue-100 dark:bg-blue-900/50 dark:text-blue-300 px-2 py-0.5 rounded-full">
                {check.type}
              </span>
            </div>
          ))}
        </div>
        
        {/* RUN BUTTON */}
        <button
          onClick={handleRunChecks}
          disabled={!isReadyToRun || processingStatus === 'loading'}
          className="w-full flex items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-white font-semibold hover:bg-blue-600 disabled:bg-gray-400"
        >
          {processingStatus === 'loading' ? (
            <>
              <Loader className="mr-2 h-5 w-5 animate-spin" />
              Running Checks...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-5 w-5" />
              Run {selectedChecks.length} Checks
            </>
          )}
        </button>
      </div>

      {/* COLUMN 2: RESULTS AND SUMMARY (2/3 Width) */}
      <div className="col-span-2 space-y-6">
        <h3 className="text-xl font-bold dark:text-white">3. Validation Results Summary</h3>
        
        {processingStatus === 'idle' && (
            <div className="p-8 text-center bg-gray-50 rounded-lg dark:bg-gray-800 dark:text-gray-400">
                Upload both files and select checks to begin validation.
            </div>
        )}

        {/* --- DATA GRID TABLE VIEW --- */}
        {processingStatus !== 'idle' && (
          <div className={`h-[500px] w-full ${validationResults.length === 0 && processingStatus === 'complete' ? 'hidden' : ''}`}>
             <DataGrid
                rows={validationResults}
                columns={getSummaryColumns(isDarkMode)}
                columnVisibilityModel={columnVisibilityModel}
                getRowId={(row) => row.id as GridRowId}
                initialState={{
                    pagination: { paginationModel: { pageSize: 7 } },
                }}
                pageSizeOptions={[5, 7, 10]}
                disableRowSelectionOnClick
                className={dataGridClassNames}
                sx={dataGridSxStyles(isDarkMode)}
             />
          </div>
        )}
        {/* --- END DATA GRID TABLE VIEW --- */}
        
        {processingStatus === 'complete' && validationResults.length === 0 && (
            <div className="p-8 text-center bg-yellow-50 rounded-lg dark:bg-yellow-900/50 dark:text-yellow-200">
                No issues detected or no relevant checks were run.
            </div>
        )}
      </div>
    </div>
  );
};

export default BoardView;
