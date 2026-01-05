using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PetShop.Helpers;

namespace PetShop.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;
        private readonly string[] _allowedExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
        private const long MaxFileSize = 5 * 1024 * 1024; // 5MB

        public UploadController(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        [HttpPost("image")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return ResponseHelper.BadRequest("No file uploaded");
                }

                if (file.Length > MaxFileSize)
                {
                    return ResponseHelper.BadRequest("File size exceeds 5MB limit");
                }

                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (!_allowedExtensions.Contains(extension))
                {
                    return ResponseHelper.BadRequest("Invalid file type. Allowed: jpg, jpeg, png, gif, webp");
                }

                // Create uploads folder if it doesn't exist
                var uploadsFolder = Path.Combine(_environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                // Generate unique filename
                var uniqueFileName = $"{Guid.NewGuid()}{extension}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                // Save file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Return the URL
                var fileUrl = $"/uploads/{uniqueFileName}";

                return ResponseHelper.Ok(new
                {
                    url = fileUrl,
                    fileName = uniqueFileName,
                    message = "Upload successful"
                });
            }
            catch (Exception ex)
            {
                return ResponseHelper.BadRequest($"Upload failed: {ex.Message}");
            }
        }

        [HttpPost("images")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UploadImages(List<IFormFile> files)
        {
            try
            {
                if (files == null || files.Count == 0)
                {
                    return ResponseHelper.BadRequest("No files uploaded");
                }

                var uploadedUrls = new List<string>();
                var uploadsFolder = Path.Combine(_environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads");
                
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                foreach (var file in files)
                {
                    if (file.Length > MaxFileSize)
                    {
                        continue; // Skip files that are too large
                    }

                    var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                    if (!_allowedExtensions.Contains(extension))
                    {
                        continue; // Skip invalid file types
                    }

                    var uniqueFileName = $"{Guid.NewGuid()}{extension}";
                    var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    uploadedUrls.Add($"/uploads/{uniqueFileName}");
                }

                return ResponseHelper.Ok(new
                {
                    urls = uploadedUrls,
                    count = uploadedUrls.Count,
                    message = "Upload successful"
                });
            }
            catch (Exception ex)
            {
                return ResponseHelper.BadRequest($"Upload failed: {ex.Message}");
            }
        }
    }
}
