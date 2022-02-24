export const uploadFile = async (files: File[], tags: String[])=> {
    const data: any = []
    await Promise.all(
        files.map(async (file) => {
            console.log(file)
            return new Promise(async (resolve) => {
                const formData = new FormData()
                formData.append('file', file)
                formData.append('upload_preset', `${process.env.UPLOAD_PRESET}`)
                formData.append('api_key',  `${process.env.API_KEY}`)
                formData.append('cloud_name', `${process.env.CLOUD_NAME}`)
                tags.map((tag: any )=> {
                    formData.append('tags[]', tag)
                })

                const result = await fetch('https://api.cloudinary.com/v1_1/hoang161201/raw/upload', {
                  method: 'POST',
                  body: formData,
                }).then(e=> e.json())
                data.push(result)
                resolve(result)
            })
        })
    )
    return data
}