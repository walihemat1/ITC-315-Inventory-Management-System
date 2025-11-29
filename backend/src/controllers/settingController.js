import Setting from '../models/settingModel.js'



export const createSetting = async (req ,res)=>{

    try {
        const {shopName, address, currency, taxRate, logUrl} = req.body

        // check all fields
        if(!shopName || !address || !currency || ! !taxRate || logUrl) return res.status(400).json({
            success: false,
            message: "All fields are required"
        })


        // create setting
        const setting = await Setting.create(req.body)

        // return a created response (201)
        res.status(201).json({
            success: true,
            message: "setting added successfully"
        })

    } catch (error) {
        console.log("Error in createSetting controller: ", error)
        res.status(500).json({
            success: false,
            message: "Internal server error" || error.message
        })
    }
}