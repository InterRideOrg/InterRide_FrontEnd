import { TimePicker, LocalizationProvider, DatePicker } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { getProvinces } from "../../constants/provinces"
import FormControl from "@mui/material/FormControl"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import './MainFilter.css' 
import filterIcon from '../../assets/images/filterIcon.webp'

const MainFilter = ({
    timeFrom, setTimeFrom,
    timeTo, setTimeTo,
    date, setDate,
    province, setProvince
}) => {
    const provinces = getProvinces()

    

    return (
        <form className="sec-filter">
            <div className="filter-icon">
                <h6>Filtrar</h6>
                <img src={filterIcon} alt="Icono de filtro" />
            </div>
            <div className="filter-group">
                <label htmlFor="hora-desde">Hora de inicio del viaje</label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                        label="Desde"
                        value={timeFrom}
                        onChange={setTimeFrom}
                        id="hora-desde"
                        slotProps={{ textField: { size: "small" } }}
                    />
                </LocalizationProvider>
                
            </div>
            <div className="filter-group">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                        label="Hasta"
                        value={timeTo}
                        onChange={setTimeTo}
                        id="hora-hasta"
                        slotProps={{ textField: { size: "small" } }}
                    />
                </LocalizationProvider>
            </div>

            <div className="filter-group">
                <label htmlFor="provincia">Provincia</label>
                <FormControl sx={{ minHeight: 45, minWidth: 120 }}>
                    <Select
                        id="provincia"
                        value={province}
                        onChange={e => setProvince(e.target.value)}
                        displayEmpty
                    >
                        <MenuItem disabled value="">
                            <em>Seleccione</em>
                        </MenuItem>
                        {provinces.map((prov) => (
                            <MenuItem key={prov.id} value={prov.name}>
                                {prov.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>

            <div className="filter-group">
                <label htmlFor="fecha">Fecha</label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        id="fecha"
                        value={date}
                        onChange={setDate}
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
                        setTimeFrom(null)
                        setTimeTo(null)
                        setDate(null)
                        setProvince("")
                    }}
                >
                    Limpiar filtros
                </button>
            </div>
        </form>
    )
}

export default MainFilter
