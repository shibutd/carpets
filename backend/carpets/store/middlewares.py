import logging

from django.db import connection

logger = logging.getLogger(__name__)


class QueryCountDebugMiddleware:
    """
    This middleware will log the number of queries run
    and the total time taken for each request.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Code to be executed for each request before
        # the view (and later middleware) are called.
        response = self.get_response(request)
        total_time = 0

        for idx, query in enumerate(connection.queries, 1):
            query_time = query.get('time')
            if query_time is None:
                query_time = query.get('duration', 0) / 1000
            total_time += float(query_time)

            logger.warning('Query № %s: %s' % (idx, query))

        logger.warning('%s queries run, total %s seconds' % (
            len(connection.queries),
            total_time)
        )

        return response
