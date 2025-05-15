import styles from './containerOptions.module.css'
import CustomDate from '../customInputs/customDate/CustomDate';
import InputUsuarios from '../customInputs/inputUsuarios/InputUsuarios';
import Recientes from '../customInputs/recientes/Recientes';
import Location from '../customInputs/location/Location';
import InputRegistro from '../customInputs/inputRegistro/InputRegistro';

type Prop = {
  recientes?: boolean,
  tipoRegistro?: boolean,
  ubicacion?: boolean,
  date?: boolean,
  usuarios?: boolean,
  startDate: Date | null,
  setStartDate: React.Dispatch<React.SetStateAction<Date | null>>,
  endDate: Date | null,
  setEndDate: React.Dispatch<React.SetStateAction<Date | null>>,
  option: string,
  setOption: React.Dispatch<React.SetStateAction<string>>,
  localizacion: string,
  setLocalizacion: React.Dispatch<React.SetStateAction<string>>
  reciente: boolean,
  setReciente: React.Dispatch<React.SetStateAction<boolean>>,
  checkedState: { [key: string]: boolean },
  setCheckedState: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>,
  checkedStateRegistro: { [key: string]: boolean },
  setCheckedStateRegistro: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>,
  totalUsuarios?: number,
  totalRegistros?: number
}

export default function ContainerOptions({ recientes = false, tipoRegistro = false, ubicacion = false, date = false, usuarios = false, startDate, setStartDate, endDate, setEndDate, option, setOption, localizacion, setLocalizacion, reciente, setReciente, checkedState, setCheckedState, totalUsuarios = 0, totalRegistros = 0, checkedStateRegistro, setCheckedStateRegistro }: Prop) {

  return (
    <div className={styles.filtros}>

      {
        (recientes) &&
        <Recientes reciente={reciente} setReciente={setReciente} />
      }

      {
        (usuarios) &&
        <InputUsuarios checkedState={checkedState} setCheckedState={setCheckedState} totalUsuarios={totalUsuarios} />
      }

      {
        (tipoRegistro) &&
        <InputRegistro checkedStateRegistro={checkedStateRegistro} setCheckedStateRegistro={setCheckedStateRegistro} totalRegistros={totalRegistros} />

      }

      {
        (ubicacion) &&
        <Location localizacion={localizacion} setLocalizacion={setLocalizacion} />
      }

      {
        (date) &&
        <CustomDate startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} option={option} setOption={setOption} />
      }
    </div>
  );
}
