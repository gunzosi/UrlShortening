package boostech.code.utils;

import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Objects;
import java.util.UUID;

public class FileUploadUtil {
    public static String uploadFile(MultipartFile file, String uploadDir) throws IOException {
       if (file == null || file.isEmpty()) {
           throw new IllegalAccessError("File is empty");
       }

       String cleanFileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
       if (cleanFileName.contains("..")) {
           throw new IllegalAccessError("File name is invalid " + cleanFileName);
       }

       String fileName = UUID.randomUUID() + "_" + cleanFileName;
       Path uploadPath = Paths.get(uploadDir);

       if(!Files.exists(uploadPath)) {
           try {
               Files.createDirectories(uploadPath);
           } catch (IOException e) {
               throw new IOException("Could not create directory " + uploadPath, e);
           }
       }

       Path filePath = uploadPath.resolve(fileName);

       
    }
}
