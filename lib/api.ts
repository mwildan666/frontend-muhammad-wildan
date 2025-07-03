import axios from "axios";

const BASE_URL = "http://202.157.176.100:3001";

export async function getNegaras() {
    const res = await axios.get(`${BASE_URL}/negaras`);
    return res.data;
}

export async function getPelabuhans(id_negara: string) {
    const res = await axios.get(
        `${BASE_URL}/pelabuhans`,
        {
            params: {
                filter: JSON.stringify({ where: { id_negara } })
            }
        }
    );
    return res.data;
}

export async function getBarangs(id_pelabuhan: string) {
    const res = await axios.get(
        `${BASE_URL}/barangs`,
        {
            params: {
                filter: JSON.stringify({ where: { id_pelabuhan } })
            }
        }
    );
    return res.data;
}
