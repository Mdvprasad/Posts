import '@testing-library/jest-dom/extend-expect'
import axios from "axios";
import {render,fireEvent} from '@testing-library/react';
import fetchData from './index';
import Home from './index';

jest.mock('axios');

test('should fetch data',async ()=>{
    const {getByTestId} = render(<Home/>);
    const button = getByTestId("search");
    const mockedAxios = axios as jest.Mocked<typeof axios>; 
    const author = [{author:"Me"}];
    const resp = {data:author};
    await (mockedAxios.get as any).mockImplementationOnce(()=>Promise.resolve(resp));
    await (mockedAxios.get as any).mockResolvedValue(()=>Promise.resolve(resp));
    fireEvent.click(button);
    expect(mockedAxios.get as any).toHaveBeenCalled();
});

