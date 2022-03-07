export const uploadFile = async (files: File[], tags: String[], avatar: false)=> {
    const data: any = []
    await Promise.all(
        files.map(async (file) => {
            console.log(file)
            return new Promise(async (resolve) => {
                const formData = new FormData()
                formData.append('file', file)
                if(avatar) {
                    formData.append('upload_preset', `${process.env.UPLOAD_PRESET_AVATAR}`)
                } else {
                    formData.append('upload_preset', `${process.env.UPLOAD_PRESET}`)
                }
                formData.append('api_key',  `${process.env.API_KEY}`)
                formData.append('cloud_name', `${process.env.CLOUD_NAME}`)
                tags.map((tag: any )=> {
                    formData.append('tags[]', tag)
                })

                const result = await fetch('https://api.cloudinary.com/v1_1/hoang161201/raw/upload', {
                  method: 'POST',
                  body: formData,
                }).then(e=> e.json())
                data.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                    name: file.name
                })
                resolve(result)
            })
        })
    )
    return data
}