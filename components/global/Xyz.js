import Spreadsheet from "react-spreadsheet";
import { useState } from "react";
  
export default function Sheet(){
  const [data, setData] = useState([
    [{ value: "GfG1" }, { value: "GfG3" }],
    [{ value: "GfG2" }, { value: "GfG4" }],
  ]);
  return(
  <div>
    <h4>SpreadSheet - GeeksforGeeks</h4>
    <Spreadsheet data={data} onChange={setData} />
  </div> 
  )
    
};