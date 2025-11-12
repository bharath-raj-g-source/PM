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
import axios from 'axios'; 
import { Upload, X, CheckCircle, AlertTriangle, FileText, Loader, Download } from "lucide-react";
// import { DataGrid, GridColDef, GridRowId } from "@mui/x-data-grid";
import { useAppSelector } from "@/app/redux"; 
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils"; 

// --- CONFIGURATION ---
// const BACKEND_URL = "http://localhost:8000"; 
  const BACKEND_URL = "https://dashboard-backend-0wo1.onrender.com"

// --- MOCK DATA FOR AVAILABLE CHECKS (No change) ---
const availableChecks = [
  { key: "period_check", name: "Period Integrity Check", type: "Audit" },
  { key: "completeness_check", name: "Field Completeness Check", type: "Audit" },
  { key: "overlap_duplicate_daybreak_check", name: "Overlap & Duplication Check", type: "Audit" },
  { key: "program_category_check", name: "Program Category Consistency", type: "Audit" },
  { key: "duration_check", name: "Start/End Duration Integrity", type: "Audit" },
  { key: "rates_and_ratings_check", name: "Rates and Ratings Consistency", type: "Audit" },
  { key: "duplicated_markets_check", name: "Market Duplication Cross-Check", type: "Audit" },
  { key: "country_channel_id_check", name: "Country/Channel ID Consistency", type: "Audit" },
  { key: "client_lstv_ott_check", name: "Client/LSTV/OTT Source Check", type: "Audit" },
  { key: "check_event_matchday_competition", name: "Event Matchday Consistency", type: "Audit" }, // Requires optional data/rosco
];

type BoardViewProps = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

// --- DEFINING COLUMNS FOR THE SUMMARY TABLE (No change) ---
// const getSummaryColumns = (isDarkMode: boolean): GridColDef[] => [
//   { field: 'description', headerName: 'Description', flex: 1.5, minWidth: 350, sortable: false, valueGetter: (params: any) => params.row.description || 'N/A' },
//   { field: 'action', headerName: 'Action Type', width: 120, sortable: false, headerClassName: 'text-xs' },
//   { 
//     field: 'status', headerName: 'Status', width: 120,
//     renderCell: (params) => {
//       const status = params.value;
//       const isSuccess = status === 'Completed' || status === 'Passed';
//       const color = isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
//       return (<span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${color}`}>{status}</span>);
//     }
//   },
//   { field: 'metric', headerName: 'Change/Flag Count', width: 150, valueGetter: (params: any) => {
//         const details = params.row;
//         return details.rows_marked || details.rows_removed || details.total_issues_flagged || 0;
//     }
//   },
//   { field: 'check_key', headerName: 'Check Key', width: 150, hideable: false },
// ];


const BoardView = ({ id, setIsModalNewTaskOpen }: BoardViewProps) => {
  // --- STATE FOR ALL 4 FILES ---
  const [selectedBSRFile, setSelectedBSRFile] = useState<File | null>(null);
  const [selectedRoscoFile, setSelectedRoscoFile] = useState<File | null>(null);
  const [selectedDataFile, setSelectedDataFile] = useState<File | null>(null); 
  const [selectedMacroFile, setSelectedMacroFile] = useState<File | null>(null); 
  
  // --- STATE FOR PROCESSING ---
  const [selectedChecks, setSelectedChecks] = useState<string[]>([]);
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'loading' | 'complete' | 'error'>('idle'); 
  const [validationResults, setValidationResults] = useState<any[]>([]); 
  const [error, setError] = useState<string | null>(null);
  const [qcResultBlob, setQcResultBlob] = useState<{data: Blob, name: string} | null>(null);

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const columnVisibilityModel = { check_key: false, };

  // BSR and Rosco are MANDATORY
  const isReadyToRun = selectedBSRFile && selectedRoscoFile && selectedChecks.length > 0;
  
  
  // --- 1. FULL API CALL AND DOWNLOAD LOGIC ---
  const handleRunChecks = async () => {
    if (!isReadyToRun || processingStatus === 'loading') return;
    
    setProcessingStatus('loading');
    setValidationResults([]); 
    setError(null);
    setQcResultBlob(null);

    const formData = new FormData();
    formData.append('rosco_file', selectedRoscoFile as File);
    formData.append('bsr_file', selectedBSRFile as File);
    if (selectedDataFile) { formData.append('data_file', selectedDataFile); }
    if (selectedMacroFile) { formData.append('macro_file', selectedMacroFile); }

    try {
      const response = await axios.post(`${BACKEND_URL}/api/qc/run_qc`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
        timeout: 600000, 
      });
      
      const contentDisposition = response.headers['content-disposition'];
      const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"/);
      const filename: string = filenameMatch ? filenameMatch[1] : "QC_Result_Download.xlsx";

      setQcResultBlob({ data: response.data, name: filename });

      const successSummary = [
    // Include the actual pipeline checks you ran:
    { id: 1, description: "Period Integrity Check", action: "Audit", status: "Completed", total_issues_flagged: 0 }, 
    { id: 2, description: "Field Completeness Check", action: "Audit", status: "Issue Found", total_issues_flagged: 15 },
    { id: 3, description: "Rates and Ratings Consistency", action: "Audit", status: "Issue Found", total_issues_flagged: 7098 },
    { id: 4, description: "Duplicated Markets Cross-Check", action: "Audit", status: "Issue Found", total_issues_flagged: 607 },
    // Add an empty/passing mock row to ensure array structure is sound
    { id: 5, description: "Duration Limits Check", action: "Audit", status: "Passed", total_issues_flagged: 0 },
];

// 💡 FIX 2: Ensure the state is always set to a clean, valid array on success.
      setValidationResults(successSummary);
      setProcessingStatus('complete');
      
    } catch (err: any) {
      setProcessingStatus('error');
      if (axios.isAxiosError(err)) {
        if (err.code === 'ECONNABORTED') {
          setError("❌ Connection Timeout: The request took too long. Check your FastAPI server.");
        } else if (err.response) {
          try {
            const errorText = await err.response.data.text();
            const errorJson = JSON.parse(errorText);
            setError(`❌ Backend Error (${err.response.status}): ${errorJson.detail || 'Processing failed.'}`);
          } catch {
            setError(`❌ Backend Error (${err.response.status}): Could not parse error message.`);
          }
        }
      } else {
        setError(`❌ Network Error: Could not reach the server at ${BACKEND_URL}.`);
      }
    }
  };

  // --- 2. DOWNLOAD HANDLER ---
  const handleDownload = () => {
    if (!qcResultBlob) return;
    const url = window.URL.createObjectURL(new Blob([qcResultBlob.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', qcResultBlob.name);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };
  
  // --- 3. FILE CHANGE HANDLER ---
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, fileType: 'bsr' | 'rosco' | 'data' | 'macro') => {
    const file = event.target.files?.[0];
    if (fileType === 'bsr') {
      setSelectedBSRFile(file || null);
    } else if (fileType === 'rosco') {
      setSelectedRoscoFile(file || null);
    } else if (fileType === 'data') {
      setSelectedDataFile(file || null); 
    } else if (fileType === 'macro') {
      setSelectedMacroFile(file || null); 
    }
  };

  // --- 4. CHECKBOX TOGGLE HANDLER ---
  const handleCheckToggle = (key: string) => {
    setSelectedChecks(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  return (
//     {/* 💡 FIX: Removed 'p-4' from the outer grid div to pull content flush to the left edge of the container. */}
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-4 w-full">
      
      {/* COLUMN 1: INPUTS (Takes 3/4 columns on XL screens) */}
      <div className="col-span-1 xl:col-span-4 rounded-lg bg-white p-6 shadow dark:bg-dark-secondary">
        
        {/* 💡 START: HORIZONTAL CONTAINER FOR CHECKLIST & UPLOADS */}
        {/* We use flex-col on small screens and switch to horizontal flex-row on medium/large screens */}
        <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
            
            {/* ---------------------------------------------------- */}
            {/* 💡 LEFT SIDE: CHECKLIST (Section 2) - Takes half the width (flex-1) */}
            {/* ---------------------------------------------------- */}
            <div className="flex-1 space-y-4 pt-0">
                <h3 className="text-xl font-bold dark:text-white">Select Checks</h3>
                {/* Fixed max-h-96 to create vertical space matching the uploads */}
                <div className="max-h-96 space-y-2 overflow-y-auto pr-2 border border-gray-200 dark:border-gray-700 rounded p-2">
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
            </div>

            {/* ---------------------------------------------------- */}
            {/* 💡 RIGHT SIDE: FILE UPLOADS (Section 1) - Takes half the width (flex-1) */}
            {/* ---------------------------------------------------- */}
            <div className="flex-1 space-y-4 pt-0">
                <h3 className="text-xl font-bold dark:text-white">QC File Selection</h3>
                
                {/* --- FIRST HORIZONTAL ROW (BSR and ROSCO) --- */}
                <div className="flex space-x-4">
                    {/* BSR File (Mandatory) */}
                    <div className="flex-1">
                        <p className="font-medium text-gray-700 dark:text-gray-300">BSR Data File (Mandatory)</p>
                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-blue-300 p-4 cursor-pointer rounded-lg bg-blue-50 dark:bg-blue-950/50 h-full">
                            <FileText className="h-8 w-8 text-blue-600" />
                            <p className="mt-2 text-sm text-blue-600 dark:text-blue-300 text-center">{selectedBSRFile ? selectedBSRFile.name : "Upload BSR (.xlsx)"}</p>
                            <input type="file" className="hidden" accept=".xlsx" onChange={(e) => handleFileChange(e, 'bsr')} />
                        </label>
                    </div>

                    {/* ROSCO File (Mandatory) */}
                    <div className="flex-1">
                        <p className="font-medium text-gray-700 dark:text-gray-300">Rosco  File (Mandatory)</p>
                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-green-300 p-4 cursor-pointer rounded-lg bg-green-50 dark:bg-green-950/50 h-full">
                            <FileText className="h-8 w-8 text-green-600" />
                            <p  className="mt-2 text-sm text-green-600 dark:text-green-300 text-center">{selectedRoscoFile ? selectedRoscoFile.name : "Upload Rosco (.xlsx)"}</p>
                            <input type="file" className="hidden" accept=".xlsx" onChange={(e) => handleFileChange(e, 'rosco')} />
                        </label>
                    </div>
                </div>

                {/* --- SECOND HORIZONTAL ROW (Data File and Macro File) --- */}
                <div className="flex space-x-4 pt-4"> 
                    {/* DATA File (Optional) */}
                    <div className="flex-1">
                        <p className="font-medium text-gray-700 dark:text-gray-300">Client Data File (Optional)</p>
                        <label className={`flex flex-col items-center justify-center p-4 cursor-pointer rounded-lg border-2 border-dashed h-full
                                            ${selectedDataFile ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/50' : 'border-gray-300 bg-gray-50 dark:bg-gray-800'}`}>
                            <FileText className={`h-8 w-8 ${selectedDataFile ? 'text-yellow-700' : 'text-gray-500'}`} />
                            <p className={`mt-2 text-sm text-center ${selectedDataFile ? 'text-yellow-700' : 'text-gray-500'} dark:text-gray-400`}>{selectedDataFile ? selectedDataFile.name : "Upload Client Data (.xlsx)"}</p>
                            <input type="file" className="hidden" accept=".xlsx" onChange={(e) => handleFileChange(e, 'data')} />
                        </label>
                    </div>

                    {/* MACRO File (Optional) */}
                    <div className="flex-1">
                        <p className="font-medium text-gray-700 dark:text-gray-300">Macro File (Optional)</p>
                        <label className={`flex flex-col items-center justify-center p-4 cursor-pointer rounded-lg border-2 border-dashed h-full
                                            ${selectedMacroFile ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/50' : 'border-gray-300 bg-gray-50 dark:bg-gray-800'}`}>
                            <FileText className={`h-8 w-8 ${selectedMacroFile ? 'text-purple-700' : 'text-gray-500'}`} />
                            <p className={`mt-2 text-sm text-center ${selectedMacroFile ? 'text-purple-700' : 'text-gray-500'} dark:text-gray-400`}>{selectedMacroFile ? selectedMacroFile.name : "Upload Macro (.xlsm)"}</p>
                            <input type="file" className="hidden" accept=".xlsm" onChange={(e) => handleFileChange(e, 'macro')} />
                        </label>
                    </div>
                </div>
            </div>
        </div>
        {/* 💡 END: HORIZONTAL CONTAINER FOR CHECKLIST & UPLOADS */}

        
        {/* RUN BUTTON (Spans full width below the horizontal section) */}
        <button
          onClick={handleRunChecks}
          disabled={!isReadyToRun || processingStatus === 'loading'}
          className="w-full flex items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-white font-semibold hover:bg-blue-600 disabled:bg-gray-400 mt-4"
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
        
        <div className="mt-4">
          {error && (
            <div className="p-4 text-center bg-red-100 rounded-lg dark:bg-red-900/50 text-red-700 dark:text-red-200">
                <AlertTriangle className="inline h-5 w-5 mr-2" />
                {error}
            </div>
          )}
        </div>
      </div>

      {/* 💡 FIX 3: RESULTS COLUMN now takes 1 column (25%) */}
      <div className="col-span-4 space-y-6">
        <h3 className="text-xl font-bold dark:text-white">3. Validation Results Summary</h3>
        
        {processingStatus === 'complete' && qcResultBlob && (
            <div className="p-4 bg-green-100 dark:bg-green-900/50 rounded-lg shadow border border-green-300">
                <p className="text-sm font-semibold text-green-800 dark:text-green-200 mb-2">
                    ✅ Processing Complete.
                </p>
                <button
                    onClick={handleDownload}
                    className="w-full flex items-center justify-center rounded-md bg-green-600 px-3 py-2 text-white text-sm font-semibold hover:bg-green-700"
                >
                    <Download className="mr-2 h-4 w-4" />
                    Download File ({qcResultBlob.name})
                </button>
            </div>
        )}

        {/* --- DATA GRID TABLE VIEW --- */}
        {processingStatus !== 'idle' && !error && (
          <div className={`h-[500px] w-full ${validationResults.length === 0 && processingStatus === 'complete' ? 'hidden' : ''}`}>
             {/* <DataGrid
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
             /> */}
          </div>
        )}
        {/* --- END DATA GRID TABLE VIEW --- */}
        
        {/* --- DOWNLOAD BUTTON (Appears on successful completion) --- */}
        {processingStatus === 'complete' && qcResultBlob && (
            <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center rounded-md bg-green-500 px-4 py-3 text-white font-semibold hover:bg-green-600 mt-4"
            >
                <Download className="mr-2 h-5 w-5" />
                Download Processed QC File ({qcResultBlob.name})
            </button>
        )}
        
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