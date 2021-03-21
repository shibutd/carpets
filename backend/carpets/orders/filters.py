from django.apps import apps
from django.contrib import admin
from django.utils.translation import gettext as _
from django.db.models import Q

from orders.models import OrderStatus


class PolymorphicModelFilter(admin.SimpleListFilter):
    title = _('Тип заказа')

    parameter_name = 'polymorphic_ctype'

    def lookups(self, request, model_admin):
        return (
            (None, _('Все')),
            ('pickuporder', _('Самовывоз')),
            ('deliveryorder', _('Доставка')),
        )

    def choices(self, cl):
        for lookup, title in self.lookup_choices:
            yield {
                'selected': self.value() == lookup,
                'query_string': cl.get_query_string({
                    self.parameter_name: lookup,
                }, []),
                'display': title,
            }

    def queryset(self, request, queryset):
        if self.value() is not None:
            model = apps.get_model('store', self.value())
            return queryset.filter(Q(instance_of=model))
        return queryset


class StatusFilter(admin.SimpleListFilter):
    title = _('Статус')

    parameter_name = 'status'

    def lookups(self, request, model_admin):
        return (
            (None, _('Все')),
            (str(OrderStatus.PAID), _('Оплачен')),
            (str(OrderStatus.COMPLETED), _('Завершен')),
        )

    def choices(self, cl):
        for lookup, title in self.lookup_choices:
            yield {
                'selected': self.value() == lookup,
                'query_string': cl.get_query_string({
                    self.parameter_name: lookup,
                }, []),
                'display': title,
            }

    def queryset(self, request, queryset):
        if self.value() in map(str, (OrderStatus.PAID, OrderStatus.COMPLETED)):
            return queryset.filter(status=self.value())
        return queryset.filter(~Q(status=OrderStatus.NEW))
