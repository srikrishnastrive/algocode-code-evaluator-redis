import JavaExecutor from "../containers/javaExecutor";
import PythonExecutor from "../containers/pythonExecuter";
import CppExecutor from "../containers/runCpp";
import CodeExecutorStrategy from "../types/codeExecutorStatergy";

export default function createExecutor(codeLanguage:string):CodeExecutorStrategy | null{
    if (codeLanguage === "PYTHON"){
        return new PythonExecutor();
    }
    else if (codeLanguage === "JAVA"){
        return new JavaExecutor();
    }
    else if (codeLanguage === "CPP"){
        return new CppExecutor();
    }
    else {
        return null;
    }

}