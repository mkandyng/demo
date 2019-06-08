package com.mkandyng.instrumentservice.filter;

import org.junit.Before;
import org.junit.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import javax.servlet.FilterChain;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

/**
 * Unit tests for {@link CustomCORSFilter}
 */
public class CustomCORSFilterTest {
    private CustomCORSFilter filter;

    @Before
    public void setup() {
        filter = new CustomCORSFilter();
    }

    @Test
    public void shouldAddCorrespondingHeaders() throws Exception {
        // Given
        String domain = "https://domain.com";
        MockHttpServletRequest request = new MockHttpServletRequest(HttpMethod.GET.name(), "/instruments/");
        MockHttpServletResponse response = new MockHttpServletResponse();
        request.addHeader(HttpHeaders.ORIGIN, domain);

        FilterChain filterChain = mock(FilterChain.class);

        // When
        filter.doFilter(request, response, filterChain);

        // Then
        assertThat(response.getHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN)).isEqualTo(domain);
        assertThat(response.getHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_METHODS)).isEqualTo("POST, GET");
        assertThat(Long.parseLong(response.getHeader(HttpHeaders.ACCESS_CONTROL_MAX_AGE))).isEqualTo(3600L);
        assertThat(response.getHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_HEADERS)).isEqualTo("Content-Type, Accept, X-Requested-With, remember-me");

        verify(filterChain).doFilter(request, response);
    }
}
