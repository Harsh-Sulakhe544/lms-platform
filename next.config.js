/** @type {import('next').NextConfig} */
const nextConfig = {
    // th below code is added to configure hostname for the image 
    images: {
        domains: [
            "utfs.io"
        ]
    }
}

module.exports = nextConfig
