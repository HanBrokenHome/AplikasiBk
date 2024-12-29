import { Link } from "react-router-dom"

export const Kondisi = (props) =>{
    return(props.Kembali ? <h1 className="text-sm print:hidden">Back To Dashboard? <Link to="/Dashboard" className="text-blue-500 underline">Dashboard</Link></h1> :
         <h1 className="text-sm">Masuk Ke Halaman Laporan <Link to="/Homes" className="text-blue-500 underline">Laporan</Link></h1>)
}