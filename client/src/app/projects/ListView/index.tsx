// import Header from "@/components/Header";
// import TaskCard from "@/components/TaskCard";
// import { Task, useGetTasksQuery } from "@/state/api";
// import React from "react";

// type Props = {
//   id: string;
//   setIsModalNewTaskOpen: (isOpen: boolean) => void;
// };

// const ListView = ({ id, setIsModalNewTaskOpen }: Props) => {
//   const {
//     data: tasks,
//     error,
//     isLoading,
//   } = useGetTasksQuery({ projectId: Number(id) });

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>An error occurred while fetching tasks</div>;

//   return (
//     <div className="px-4 pb-8 xl:px-6">
//       <div className="pt-5">
//         <Header
//           name="List"
//           buttonComponent={
//             <button
//               className="flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
//               onClick={() => setIsModalNewTaskOpen(true)}
//             >
//               Add Task
//             </button>
//           }
//           isSmallText
//         />
//       </div>
//       <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
//         {tasks?.map((task: Task) => <TaskCard key={task.id} task={task} />)}
//       </div>
//     </div>
//   );
// };

// export default ListView;


import React, { useState } from "react";
import { Upload, X, CheckCircle, AlertTriangle, FileText, Loader } from "lucide-react";
import { DataGrid, GridColDef, GridRowId   } from "@mui/x-data-grid";
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

type ListViewProps = { // <-- CHANGED
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
  { field: 'check_key', headerName: 'Check Key', width: 150, hideable: false }, 
];

const ListView = ({ id, setIsModalNewTaskOpen }: ListViewProps) => { // <-- CHANGED
  // --- STATE FOR THREE FILES ---
  const [selectedBSRFile, setSelectedBSRFile] = useState<File | null>(null);
  const [selectedObligationFile, setSelectedObligationFile] = useState<File | null>(null); // Rosco renamed to Obligation
  const [selectedOvernightFile, setSelectedOvernightFile] = useState<File | null>(null); // NEW OPTIONAL FILE
  
  const [selectedChecks, setSelectedChecks] = useState<string[]>([]);
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'loading' | 'complete'>('idle');
  const [validationResults, setValidationResults] = useState<any[]>([]); 

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  // Define the model to hide specific columns
  const columnVisibilityModel = {
    check_key: false, // Explicitly hide the check_key column
  };

  // --- RUN LOGIC: Requires BSR and Obligation (Rosco) to be mandatory ---
  const isReadyToRun = selectedBSRFile && selectedObligationFile && selectedChecks.length > 0;
  
  // NOTE: You would replace this mock fetch function with actual Axios/fetch calls to your Render API
  const handleRunChecks = async () => {
    if (!isReadyToRun || processingStatus === 'loading') return;
    
    setProcessingStatus('loading');
    setValidationResults([]); 

    console.log(`Running checks on BSR: ${selectedBSRFile?.name}, Obligation: ${selectedObligationFile?.name}, Overnight: ${selectedOvernightFile?.name || 'N/A'}`);
    
    // ----------------------------------------------------
    // *** Placeholder for actual API call to Render ***
    // ----------------------------------------------------
    await new Promise(resolve => setTimeout(resolve, 2000)); 

    const rawSummary = [
      { check_key: "check_italy_mexico_dupes", status: "Completed", action: "Consolidation", rows_marked: 23, description: "Consolidated 23 exact duplicates." },
      { check_key: "remove_viaplay_baltics", status: "Completed", action: "Removal", rows_removed: 11, description: "Removed 11 Viaplay Baltic rows." },
      { check_key: "check_latam_espn", status: "Issue Found", action: "Audit", total_issues_flagged: 2, description: "2 markets missing ESPN coverage." },
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, fileType: 'bsr' | 'obligation' | 'overnight') => {
    const file = event.target.files?.[0];
    if (fileType === 'bsr') {
      setSelectedBSRFile(file || null);
    } else if (fileType === 'obligation') {
      setSelectedObligationFile(file || null);
    } else if (fileType === 'overnight') {
        setSelectedOvernightFile(file || null);
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
        
        {/* --- BSR FILE UPLOAD (Mandatory) --- */}
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

        {/* --- OBLIGATION FILE UPLOAD (Mandatory) --- */}
        <p className="font-medium text-gray-700 dark:text-gray-300">Obligation/Rosco File (Mandatory)</p>
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-green-300 p-4 cursor-pointer rounded-lg bg-green-50 dark:bg-green-950/50">
          <FileText className="h-8 w-8 text-green-600" />
          <p className="mt-2 text-sm text-green-600 dark:text-green-300 text-center">
            {selectedObligationFile ? selectedObligationFile.name : "Click to upload Obligation/Rosco File (.xlsx)"}
          </p>
          <input 
            type="file" 
            className="hidden" 
            accept=".xlsx" 
            onChange={(e) => handleFileChange(e, 'obligation')} 
            />
        </label>
        
        {/* --- OVERNIGHT FILE UPLOAD (Optional) --- */}
        <p className="font-medium text-gray-700 dark:text-gray-300">Overnight Audience File (Optional)</p>
        <label className={`flex flex-col items-center justify-center border-2 border-dashed p-4 cursor-pointer rounded-lg 
                            ${selectedOvernightFile 
                                ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/50' 
                                : 'border-gray-300 bg-gray-50 dark:bg-gray-800'}`}>
          <FileText className={`h-8 w-8 ${selectedOvernightFile ? 'text-yellow-700' : 'text-gray-500'}`} />
          <p className={`mt-2 text-sm ${selectedOvernightFile ? 'text-yellow-700' : 'text-gray-500'} dark:text-gray-400 text-center`}>
            {selectedOvernightFile ? selectedOvernightFile.name : "Click to upload Overnight Audiences (.xlsx)"}
          </p>
          <input 
            type="file" 
            className="hidden" 
            accept=".xlsx" 
            onChange={(e) => handleFileChange(e, 'overnight')} 
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
                  Upload both mandatory files and select checks to begin validation.
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

  export default ListView; // <-- Changed export name
