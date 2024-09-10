import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";

const Assessment = () => {
  const [excelData, setExcelData] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);
        setExcelData(data);
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleClear = () => {
    setExcelData([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-600 p-5">
      <div className="h-[10vh] w-full flex items-center justify-between mt-3 px-10 border rounded-lg shadow-2xl ">
        <div className="text-2xl font-semibold text-white">
          Upload Your Excel
        </div>
        <div className="flex flex-row justify-center items-center gap-4">
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            className="border p-3 rounded-lg text-white"
            ref={fileInputRef}
          />
          <button
            onClick={handleClear}
            className="h-[6vh] rounded-lg p-2 px-4 bg-red-400 hover:bg-red-500"
          >
            Clear
          </button>
          <button className="h-[6vh] rounded-lg p-2 px-4 bg-green-400 hover:bg-green-500">
            Upload
          </button>
        </div>
      </div>

      {/* Display the uploaded Excel data */}
      <div className="mt-10 bg-white p-5 rounded-lg">
        {excelData.length > 0 ? (
          <table className="w-full table-auto">
            <thead>
              <tr>
                {Object?.keys(excelData[0]).map((key) => (
                  <th key={key} className="border px-4 py-2">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {excelData.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, i) => (
                    <td key={i} className="border px-4 py-2">
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-gray-600">No data uploaded yet.</div>
        )}
      </div>
    </div>
  );
};

export default Assessment;
