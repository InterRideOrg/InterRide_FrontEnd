import { TimePicker, LocalizationProvider, DatePicker } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
//import { getProvinces } from "../../constants/provinces"
import FormControl from "@mui/material/FormControl"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import './MainFilter.css' 
import filterIcon from '../../assets/images/filterIcon.webp'

const MainFilter = ({
    dateFrom, setDateFrom,
    dateTo, setDateTo,
}) => {
    //const provinces = getProvinces()

    return (
        <form className="sec-filter">
            <div className="filter-icon">
                <h6>Filtrar</h6>
                <img src={filterIcon} alt="Icono de filtro" />
            </div>
            <div className="filter-group">
                <label htmlFor="fechaInicio">Fecha</label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        id="fechaInicio"
                        value={dateFrom}
                        onChange={setDateFrom}
                        format="DD/MM/YYYY"
                        slotProps={{ textField: { size: "small" } }}
                    />
                </LocalizationProvider>
            </div>
            <div className="filter-group">
                <label htmlFor="fechaFin">Fecha Fin</label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        id="fechaFin"
                        value={dateTo}
                        onChange={setDateTo}
                        format="DD/MM/YYYY"
                        slotProps={{ textField: { size: "small" } }}
                    />
                </LocalizationProvider>
            </div>
            <div className="filter-group" >
                <button
                    type="button"
                    className="clear-filters-btn"
                    onClick={() => {
                        setDateFrom(null)
                        setDateTo(null)
                    }}
                >
                    Limpiar filtros
                </button>
            </div>
        </form>
    )
}

export default MainFilter
