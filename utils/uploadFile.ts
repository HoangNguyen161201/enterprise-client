export const uploadFile = async (files: File[], tags: String[])=> {
    const data: any = []
    await Promise.all(
        files.map(async (file) => {
            return new Promise(async (resolve) => {
                const formData = new FormData()
                formData.append('file', file)
                formData.append('upload_preset', 'ideaSubmission')
                formData.append('api_key', '127883878126518')
                formData.append('cloud_name', 'hoang161201')
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