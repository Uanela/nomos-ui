import FormInput from "../../components/form-input";
import Input from "../../components/input";
import { useForm } from "react-hook-form";

function App() {
  const form = useForm();

  return (
    <div>
      <FormInput control={form.control} name="email" label="Email" />
      <Input />
      <div className="bg-red-500">Uanela Como</div>
      {/* <p className="font-bold">Uanela Como</p> */}
    </div>
  );
}

export default App;
