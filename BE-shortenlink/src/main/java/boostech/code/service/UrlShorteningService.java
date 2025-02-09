package boostech.code.service;

import boostech.code.models.UrlShortening;
import boostech.code.models.User;
import boostech.code.payload.request.UrlRequest;
import boostech.code.payload.request.UrlRequestUpdate;
import boostech.code.payload.response.UrlResponse;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public interface UrlShorteningService {
    // CREATE - UPDATE - DELETE
    UrlResponse shortenUrl(UrlRequest urlRequest);
    UrlRequest redirectUrl(String urlCode);
    Optional<UrlShortening> getLongUrlByCode(String urlCode);
    void deleteUrl(String urlCode);
    boolean isUrlExists(String code);
    UrlResponse updateUrlCode(String urlCode, UrlRequest urlRequest);
    UrlResponse updateUrlCode(String oldUrlCode, UrlRequestUpdate urlRequestUpdate);
    UrlResponse getAllUrls();

    // GET UUID
    Optional<UrlShortening> findByShortUrl(String shortUrl);
    boolean existsByShortUrl(String shortUrl);
    UrlResponse findIdByShortUrl(String shortUrl);
    UUID getUUIDByUrlCode(String urlCode);

    UrlResponse checkUrlCodeAvailability(String urlCode);
    UrlResponse getUserUrls();
    UrlResponse getUserUrlsById(Long userId);
    User findUserByUrlCode(String urlCode);

    // UpdateV2
    UrlResponse updateUrlCodeV2(String oldUrlCode, UrlRequestUpdate urlRequestUpdate);
}
